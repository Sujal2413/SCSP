from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_alter_student_address_alter_student_annual_income_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="PendingRegistration",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("full_name", models.CharField(max_length=100)),
                ("username", models.CharField(max_length=150)),
                ("email", models.EmailField(max_length=254, unique=True)),
                ("mobile", models.CharField(max_length=15)),
                ("password_hash", models.CharField(max_length=255)),
                ("otp_code", models.CharField(max_length=6)),
                ("attempts", models.IntegerField(default=0)),
                ("resend_count", models.IntegerField(default=0)),
                ("otp_sent_at", models.DateTimeField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
