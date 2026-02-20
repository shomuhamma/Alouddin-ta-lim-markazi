from rest_framework import serializers
from .models import CourseApplication, VacancyApplication


class CourseApplicationSerializer(serializers.ModelSerializer):
    # Frontend "days" yuborsa, backend uni lesson_day sifatida qabul qiladi
    days = serializers.ChoiceField(
        choices=CourseApplication.DAY_CHOICES,
        write_only=True,
        source="lesson_day",
    )

    class Meta:
        model = CourseApplication
        fields = ["id", "full_name", "phone", "subject", "days", "lesson_day", "created_at"]
        read_only_fields = ["id", "lesson_day", "created_at"]  # lesson_day ni frontend yubormaydi, days yuboradi


class VacancyApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = VacancyApplication
        fields = "__all__"
