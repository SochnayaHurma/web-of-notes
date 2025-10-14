from django.urls import path

from .views import get_lessons, get_tags, get_subjects, get_statuses
from . import views

app_name = "note"

urlpatterns = [
    path("notes/", get_lessons),
    path("tags/", get_tags),
    path("subjects/", get_subjects),
    path("statuses/", get_statuses),
    path("notes/attach/", view=views.upload_md_content),
    path("notes/attach/<int:file_id>/", view=views.download_md_content, name='download_md_content')
]