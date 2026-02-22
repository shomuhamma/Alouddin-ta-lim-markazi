from django.db import models


class CourseApplication(models.Model):
    SUBJECT_CHOICES = [
        ("ingliz", "Ingliz tili"),
        ("rus", "Rus tili"),
        ("koreys", "Koreys tili"),
        ("xitoy", "Xitoy tili"),
        ("ona", "Ona tili"),
        ("tarix", "Tarix"),
        ("pochemuchka", "Pochemuchka"),
        ("mental", "Mental arifmetika"),
        ("kompyuter", "Kompyuter savodxonligi"),
        ("backend", "Backend dasturlash"),
        ("kimyo", "Kimyo"),
        ("biologiya", "Biologiya"),
    ]

    DAY_CHOICES = [
        ("du_ju", "Dushanba / Juma"),
        ("se_pa", "Seshanba / Payshanba"),
        ("sh_yn", "Shanba / Yakshanba"),
        ("boshqa", "Boshqa (admin bilan aniqlanadi)"),
    ]

    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30, db_index=True)

    # ⚠️ React bu yerga "ingliz", "rus" kabi KEY yuborishi kerak (label emas)
    subject = models.CharField(max_length=50, choices=SUBJECT_CHOICES)

    # ⚠️ React bu yerga "du_ju" kabi KEY yuborishi kerak
    lesson_day = models.CharField(max_length=50, choices=DAY_CHOICES)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} ({self.phone}) - {self.subject}"


class VacancyApplication(models.Model):
    GENDER_CHOICES = [
        ("male", "Erkak"),
        ("female", "Ayol"),
    ]

    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30, db_index=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)

    birth_date = models.DateField(null=True, blank=True)
    about = models.TextField(blank=True)

    # Fayl yuborish uchun frontend multipart/form-data ishlatadi (FormData)
    certificates = models.FileField(upload_to="certificates/", null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} ({self.phone})"
