# Generated by Django 2.1.7 on 2019-03-18 14:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('synchro', '0003_auto_20190318_1418'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='users', to='synchro.Group'),
        ),
    ]
