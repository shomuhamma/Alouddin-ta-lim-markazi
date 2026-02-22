from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse


# ✅ QO‘SHILDI — home view
def home(request):
    return HttpResponse("Django backend ishlayapti ✅")


urlpatterns = [
    path("", home, name="home"),        # ✅ ASOSIY YECHIM
    path("admin/", admin.site.urls),
    path("api/", include("applications.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
