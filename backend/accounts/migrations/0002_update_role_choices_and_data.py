from django.db import migrations, models


def map_legacy_roles(apps, schema_editor):
    User = apps.get_model('accounts', 'User')
    User.objects.filter(role='HR').update(role='SUPERVISOR')
    User.objects.filter(role='EMPLOYEE').update(role='STAFF')


class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(map_legacy_roles, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(
                choices=[
                    ('SUPERVISOR', 'Supervisor'),
                    ('ADMIN', 'Admin'),
                    ('STAFF', 'Staff'),
                ],
                max_length=20,
            ),
        ),
    ]
