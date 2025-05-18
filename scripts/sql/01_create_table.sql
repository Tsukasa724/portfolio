-- Contents: Create triggers for updating updated_at column
create function public.refresh_updated_at_step1() returns trigger
    language plpgsql
as
$$
BEGIN
    IF NEW.updated_at = OLD.updated_at THEN
        NEW.updated_at := NULL;
    END IF;
    RETURN NEW;
END;
$$;

create function public.refresh_updated_at_step2() returns trigger
    language plpgsql
as
$$
BEGIN
    IF NEW.updated_at IS NULL THEN
        NEW.updated_at := OLD.updated_at;
    END IF;
    RETURN NEW;
END;
$$;

create function public.refresh_updated_at_step3() returns trigger
    language plpgsql
as
$$
BEGIN
    IF NEW.updated_at IS NULL THEN
        NEW.updated_at := CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$;

-- 在庫判定用トリガー
create or replace function public.update_stock_status()
returns trigger
language plpgsql
as $$
begin
    if NEW.item_stock < NEW.order_threshold then
        NEW.stock_status := '在庫不足';
    else
        NEW.stock_status := '在庫有り';
    end if;
    return NEW;
end;
$$;

-- 在庫不足検出用トリガー関数
create or replace function public.handle_out_of_stock()
returns trigger
language plpgsql
as $$
begin
    -- 在庫不足の新規登録または在庫状態の変更
    if (TG_OP = 'INSERT' or (TG_OP = 'UPDATE' and NEW.stock_status = '在庫不足' and OLD.stock_status != '在庫不足')) then

        -- **在庫不足**のレコードのみ追加
        if NEW.stock_status = '在庫不足' then
            insert into public.out_of_stock_items (id, item_name, item_stock, order_threshold, out_of_stock_timestamp)
            values (NEW.id, NEW.item_name, NEW.item_stock, NEW.order_threshold, CURRENT_TIMESTAMP)
            on conflict (id) do update
            set item_name = excluded.item_name,
                item_stock = excluded.item_stock,
                order_threshold = excluded.order_threshold,
                out_of_stock_timestamp = excluded.out_of_stock_timestamp;
        end if;
    end if;

    return NEW;
end;
$$;

-- out_of_stock_itemsに対するorder_statusの変更時にレコードを削除するトリガー
create or replace function public.handle_order_status()
returns trigger
language plpgsql
as $$
begin
    -- "発注完了" または "取消" に変更された場合にレコードを削除
    if (NEW.order_status = '発注完了' or NEW.order_status = '取消') then
        delete from public.out_of_stock_items where id = NEW.id;
    end if;

    return NEW;
end;
$$;

-- 発注ステータス更新用トリガー
create or replace function public.update_order_status_on_change()
returns trigger
language plpgsql
as $$
declare
    new_history_id smallint;
begin
    -- "発注待ち"から"発注完了"に変更された場合
    if OLD.order_status = '発注待ち' and NEW.order_status = '発注完了' then

        -- order_historyに新しい履歴を追加
        insert into public.order_history (item_id, history_status)
        values (NEW.id, '発注完了')
        returning id into new_history_id;

        -- order_statusに新しいステータスを追加
        insert into public.order_status (history_id, current_status)
        values (new_history_id, '発注中');

    -- "発注待ち"から"取消"に変更された場合
    elsif OLD.order_status = '発注待ち' and NEW.order_status = '取消' then

        -- order_historyに新しい履歴を追加
        insert into public.order_history (item_id, history_status)
        values (NEW.id, '発注取消')
        returning id into new_history_id;

        -- order_statusに新しいステータスを追加
        insert into public.order_status (history_id, current_status)
        values (new_history_id, '発注中止');

    end if;

    return NEW;
end;
$$;

-- 発注中となっている在庫物が増加された場合に受け取り完了とするトリガー
create or replace function public.handle_stock_reception()
returns trigger
language plpgsql
as $$
begin
    -- 在庫が増加している場合
    if NEW.item_stock > OLD.item_stock then
        -- 発注中のステータスを受け取り完了に更新
        update public.order_status
        set current_status = '受け取り完了',
            updated_at = CURRENT_TIMESTAMP
        where history_id in (
            select id from public.order_history
            where item_id = NEW.id
        )
        and current_status = '発注中';
    end if;

    return NEW;
end;
$$;



-- Table: public.account
create table public.account (
    id uuid default gen_random_uuid() not null,
    email TEXT not null,
    password_hash TEXT not null,
    role TEXT not null,
    created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    is_deleted boolean default false not null
);

alter table only public.account add constraint account_pkey primary key (id);
alter table only public.account add constraint account_email_key unique (email);

create trigger refresh_account_updated_at_step1
    before update
    on public.account
    for each row
execute function public.refresh_updated_at_step1();

create trigger refresh_account_updated_at_step2
    before update
        of updated_at
    on public.account
    for each row
execute function public.refresh_updated_at_step2();

create trigger refresh_account_update_at_step3
    before update
    on public.account
    for each row
execute function public.refresh_updated_at_step3();


-- Table: public.inventory_items
create table public.inventory_items (
    id smallint not null,
    item_name TEXT not null,
    item_stock INTEGER not null,
    order_threshold INTEGER not null,
    stock_status TEXT not null,
    created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    is_deleted boolean default false not null
);

create sequence public.inventory_items_id_seq
    as smallint
    start with 11
    increment by 1
    no minvalue
    no maxvalue
    cache 1;

alter sequence public.inventory_items_id_seq owned by public.inventory_items.id;
alter table only public.inventory_items alter column id set default nextval('public.inventory_items_id_seq'::regclass);
alter table only public.inventory_items add constraint inventory_items_pkey primary key (id);


create trigger refresh_user_updated_at_step1
    before update
    on public.inventory_items
    for each row
execute function public.refresh_updated_at_step1();

create trigger refresh_user_updated_at_step2
    before update
        of updated_at
    on public.inventory_items
    for each row
execute function public.refresh_updated_at_step2();

create trigger refresh_user_updated_at_step3
    before update
    on public.inventory_items
    for each row
execute function public.refresh_updated_at_step3();

-- 在庫判定用トリガーの登録
create trigger update_stock_status_trigger
before insert or update of item_stock, order_threshold
on public.inventory_items
for each row
execute function public.update_stock_status();


-- Table: public.order_history
create table public.order_history (
    id smallint not null,
    item_id smallint not null,
    history_status TEXT not null,
    created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    is_deleted boolean default false not null
);

create sequence public.order_history_id_seq
    as smallint
    start with 1
    increment by 1
    no minvalue
    no maxvalue
    cache 1;

alter sequence public.order_history_id_seq owned by public.order_history.id;
alter table only public.order_history alter column id set default nextval('public.order_history_id_seq'::regclass);
alter table only public.order_history add constraint order_history_pkey primary key (id);
alter table only public.order_history add constraint order_history_item_id_fkey foreign key (item_id) references public.inventory_items(id) not valid;

create trigger refresh_user_updated_at_step1
    before update
    on public.order_history
    for each row
execute function public.refresh_updated_at_step1();

create trigger refresh_user_updated_at_step2
    before update
        of updated_at
    on public.order_history
    for each row
execute function public.refresh_updated_at_step2();

create trigger refresh_user_updated_at_step3
    before update
    on public.order_history
    for each row
execute function public.refresh_updated_at_step3();


-- Table: public.order_status
create table public.order_status (
    id smallint not null,
    history_id smallint not null,
    current_status TEXT not null,
    created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    is_deleted boolean default false not null
);

create sequence public.order_status_id_seq
    as smallint
    start with 1
    increment by 1
    no minvalue
    no maxvalue
    cache 1;

alter sequence public.order_status_id_seq owned by public.order_status.id;
alter table only public.order_status alter column id set default nextval('public.order_status_id_seq'::regclass);
alter table only public.order_status add constraint order_status_pkey primary key (id);
alter table only public.order_status add constraint order_status_history_id_fkey foreign key (history_id) references public.order_history(id) not valid;

create trigger refresh_user_updated_at_step1
    before update
    on public.order_status
    for each row
execute function public.refresh_updated_at_step1();

create trigger refresh_user_updated_at_step2
    before update
        of updated_at
    on public.order_status
    for each row
execute function public.refresh_updated_at_step2();

create trigger refresh_user_updated_at_step3
    before update
    on public.order_status
    for each row
execute function public.refresh_updated_at_step3();

-- item_stockの変更に応じて処理を実行するトリガーを発火
create trigger trigger_handle_stock_reception
after update of item_stock on public.inventory_items
for each row
execute function public.handle_stock_reception();


-- 在庫不足アイテムを保存するテーブル
create table public.out_of_stock_items (
    id smallint not null,
    item_name TEXT not null,
    item_stock INTEGER not null,
    order_threshold INTEGER not null,
    out_of_stock_timestamp timestamp with time zone default CURRENT_TIMESTAMP not null,
    order_status TEXT not null default '発注待ち',
    is_deleted boolean default false not null
);

alter table only public.out_of_stock_items add constraint out_of_stock_items_pkey primary key (id);
alter table only public.out_of_stock_items add constraint out_of_stock_items_id_fkey foreign key (id) references public.inventory_items(id) on delete cascade;

-- inventory_itemsに在庫ステータスが変更されたときにトリガーを発火
create trigger handle_out_of_stock_trigger
after insert or update on public.inventory_items
for each row
execute function public.handle_out_of_stock();

-- order_statusの変更に応じて処理を実行するトリガーを発火
create trigger trigger_update_order_status_on_change
after update of order_status on public.out_of_stock_items
for each row
execute function public.update_order_status_on_change();

create trigger trigger_handle_order_status
after update of order_status on public.out_of_stock_items
for each row
execute function public.handle_order_status();