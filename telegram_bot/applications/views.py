from rest_framework import generics, permissions
from .models import CourseApplication, VacancyApplication
from .serializers import (
    CourseApplicationSerializer,
    VacancyApplicationSerializer,
)


class CourseApplicationCreateView(generics.CreateAPIView):
    queryset = CourseApplication.objects.all()
    serializer_class = CourseApplicationSerializer
    permission_classes = [permissions.AllowAny]


class VacancyApplicationCreateView(generics.CreateAPIView):
    queryset = VacancyApplication.objects.all()
    serializer_class = VacancyApplicationSerializer
    permission_classes = [permissions.AllowAny]
