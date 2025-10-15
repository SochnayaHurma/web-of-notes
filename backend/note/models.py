import uuid

from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.urls import reverse

class DisciplineModel(models.Model):
    name = models.CharField(max_length=40)

    def __str__(self):
        return self.name
        
    class Meta:
        verbose_name = 'Дисциплина'
        verbose_name_plural = 'Дисциплины'

class SubjectModel(models.Model):
    title = models.CharField(max_length=40)
    discipline = models.ForeignKey(DisciplineModel, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.title} ({self.discipline})'
    
    class Meta:
        verbose_name = 'Предмет'
        verbose_name_plural = 'Предметы'

class TagModel(models.Model):
    name = models.CharField(max_length=30)
    # discipline = models.ForeignKey(DisciplineModel, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Тэг'
        verbose_name_plural = 'Тэги'
class StatusModel(models.Model):
    name = models.CharField(max_length=40)
    default = models.BooleanField(default=False)

    def clean(self):
        if self.default:
            if StatusModel.objects.filter(default=True).exclude(id=self.id).exists():
                raise ValidationError("Только один статус может быть с меткой default")

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Статус'
        verbose_name_plural = 'Статусы'


class AttachContent(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4)
    name = models.CharField(max_length=60)
    file = models.FileField('Местонахождения файла', blank=False, null=False)
    created_at = models.DateTimeField('Дата добавления', default=timezone.now)
    user_session = models.CharField(max_length=40)
    is_tmp = models.BooleanField(default=True)
    note = models.ForeignKey("NoteModel", on_delete=models.SET_NULL, null=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.file.name = self.get_upload_path()
        super().save(*args, **kwargs)

    def get_upload_path(self):
        model_name = self.__class__.__name__.lower() 
        return f'files_from_model/{model_name}/{self.uuid}/{self.file.name}'
    
    def get_absolute_url(self):
        return reverse('note:download_md_content', kwargs={'file_id': self.id})  

class NoteModel(models.Model):
    subject = models.ForeignKey(SubjectModel, on_delete=models.CASCADE)
    title = models.CharField(max_length=40)
    content = models.TextField()
    tags = models.ManyToManyField(TagModel)
    status = models.ForeignKey(StatusModel, on_delete=models.CASCADE, null=True)
    created_date = models.DateTimeField(verbose_name="Дата создания", default=timezone.now)
    count_used = models.IntegerField(verbose_name="Количество прохождениий", default=0)


    def save(self, *args, **kwargs):
        if not self.status:
            default_status = StatusModel.objects.filter(default=True).first()
            if default_status:
                self.status = default_status
            else:
                raise ValidationError("Не назначен стандартный статус для новых заметок")
        super().save(*args, **kwargs)
