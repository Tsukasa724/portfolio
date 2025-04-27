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



-- Table: public.account
create table public.account (
    id uuid default gen_random_uuid() not null,
    username TEXT not null,
    password_hash TEXT not null,
    role TEXT not null,
    created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    is_deleted boolean default false not null
);

alter table only public.account add constraint account_pkey primary key (id);
alter table only public.account add constraint account_username_key unique (username);

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
    start with 1000
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
    start with 1000
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
    start with 1000
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