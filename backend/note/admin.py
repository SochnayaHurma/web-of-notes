from django.contrib import admin

from .models import SubjectModel, NoteModel, TagModel, DisciplineModel, StatusModel

admin.site.register(SubjectModel)
admin.site.register(NoteModel)
admin.site.register(TagModel)
admin.site.register(DisciplineModel)
admin.site.register(StatusModel)
