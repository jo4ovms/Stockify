echo "Restaurando o banco de dados a partir do backup..."
psql -U $POSTGRES_USER -d $POSTGRES_DB /docker-entrypoint-initdb.d/stockifydb_dump.sql