from django.db import migrations


REPAIR_SQL = """
-- Ensure ProductCategory table exists (legacy schema never created it).
CREATE TABLE IF NOT EXISTS product_category (
    id bigserial PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text NULL
);

-- Ensure ProductType has the new nullable FK column.
ALTER TABLE product_types
    ADD COLUMN IF NOT EXISTS product_category_id bigint NULL;

-- Ensure an index exists for the FK column.
CREATE INDEX IF NOT EXISTS product_types_product_category_id_idx
    ON product_types (product_category_id);

-- Add FK constraint once.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'product_types_product_category_id_fk'
    ) THEN
        ALTER TABLE product_types
            ADD CONSTRAINT product_types_product_category_id_fk
            FOREIGN KEY (product_category_id)
            REFERENCES product_category (id)
            ON DELETE SET NULL;
    END IF;
END $$;

-- Legacy platforms_app schema used TextField for picture_path; align with current FileField(max_length=512).
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'project_pictures'
          AND column_name = 'picture_path'
          AND data_type = 'text'
    ) THEN
        ALTER TABLE project_pictures
            ALTER COLUMN picture_path TYPE varchar(512);
    END IF;
END $$;
"""


class Migration(migrations.Migration):
    dependencies = [
        ("projects_catalog", "0001_initial"),
    ]

    operations = [
        migrations.RunSQL(sql=REPAIR_SQL, reverse_sql=migrations.RunSQL.noop),
    ]

