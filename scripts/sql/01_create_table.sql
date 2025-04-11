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


-- Table: public.t_account
create table public.t_account (
    id uuid default gen_random_uuid() not null,
    email varchar(128) not null,
    created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    is_deleted boolean default false not null
);

alter table only public.t_account add constraint t_account_pkey primary key (id);
alter table only public.t_account add constraint t_account_email_key unique (email);

create trigger refresh_account_updated_at_step1
    before update
    on public.t_account
    for each row
execute function public.refresh_updated_at_step1();

create trigger refresh_account_updated_at_step2
    before update
        of updated_at
    on public.t_account
    for each row
execute function public.refresh_updated_at_step2();

create trigger refresh_account_update_at_step3
    before update
    on public.t_account
    for each row
execute function public.refresh_updated_at_step3();



-- Table: public.t_user
create table public.t_user (
    id smallint not null,
    account_id uuid not null,
    name varchar(128) not null,
    memo text,
    created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    is_deleted boolean default false not null
);

create sequence public.t_user_id_seq
    as smallint
    start with 1000
    increment by 1
    no minvalue
    no maxvalue
    cache 1;

alter sequence public.t_user_id_seq owned by public.t_user.id;
alter table only public.t_user alter column id set default nextval('public.t_user_id_seq'::regclass);
alter table only public.t_user add constraint t_user_pkey primary key (id);
alter table only public.t_user add constraint t_user_account_id_fkey foreign key (account_id) references public.t_account(id) not valid;

create trigger refresh_user_updated_at_step1
    before update
    on public.t_user
    for each row
execute function public.refresh_updated_at_step1();

create trigger refresh_user_updated_at_step2
    before update
        of updated_at
    on public.t_user
    for each row
execute function public.refresh_updated_at_step2();

create trigger refresh_user_updated_at_step3
    before update
    on public.t_user
    for each row
execute function public.refresh_updated_at_step3();
