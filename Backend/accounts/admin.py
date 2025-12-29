from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        'full_name',
        'mobile',
        'gender',
        'category',
        'annual_income',
        'created_at',
    )

    search_fields = ('full_name', 'mobile', 'caste')
    list_filter = ('gender', 'category')
