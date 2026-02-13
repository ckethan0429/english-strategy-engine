# PostgreSQL Local Setup (On-Server)

This server has PostgreSQL installed for v1.1 development.

## Service

```bash
systemctl status postgresql
```

## App DB

- Database: `speaking_engine`
- User: `speaking_app`
- Host: `127.0.0.1`
- Port: `5432`

## Environment

Set in `.env.local`:

```bash
DATABASE_URL=postgresql://speaking_app:<password>@127.0.0.1:5432/speaking_engine
```

## Verify Connection

```bash
PGPASSWORD='<password>' psql -h 127.0.0.1 -U speaking_app -d speaking_engine -c "select now();"
```

## Migration Plan (later)

- Move PostgreSQL to dedicated Proxmox LXC
- Keep schema the same
- Switch only `DATABASE_URL`
