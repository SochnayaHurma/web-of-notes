from django.urls import path

from .views import get_lessons, get_tags, get_subjects, get_statuses

app_name = "note"

urlpatterns = [
    path("notes/", get_lessons),
    path("tags/", get_tags),
    path("subjects/", get_subjects),
    path("statuses/", get_statuses),
]