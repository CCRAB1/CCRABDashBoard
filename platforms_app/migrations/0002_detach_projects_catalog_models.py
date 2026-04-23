from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("platforms_app", "0001_initial"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.DeleteModel(
                    name="HostingLocationProductType",
                ),
                migrations.DeleteModel(
                    name="ProjectPartner",
                ),
                migrations.DeleteModel(
                    name="ProjectPicture",
                ),
                migrations.DeleteModel(
                    name="HostingLocation",
                ),
                migrations.DeleteModel(
                    name="ProductType",
                ),
                migrations.DeleteModel(
                    name="ProjectCatalogPage",
                ),
            ],
        ),
    ]
