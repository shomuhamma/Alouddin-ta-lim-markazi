from django.urls import path
from .views import (
    CourseApplicationCreateView,
    VacancyApplicationCreateView,
)

urlpatterns = [
    path("course-application/", CourseApplicationCreateView.as_view(),
         name="course-application"),
    path("vacancy-application/", VacancyApplicationCreateView.as_view(), name="vacancy-application"),
]



