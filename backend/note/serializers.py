from rest_framework import serializers

from .models import NoteModel, StatusModel

class DisciplineSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(read_only=True)

class TagSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(read_only=True)

class SubjectSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(read_only=True)
    discipline = DisciplineSerializer(read_only=True)

class StatusSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(read_only=True)


class NoteSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    content = serializers.CharField(allow_blank=True)
    title = serializers.CharField(allow_blank=False, required=True)
    status = StatusSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)
    subject_id = serializers.IntegerField(write_only=True, required=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.ListField(
        write_only=True,
        required=False
    )
    created_date = serializers.DateTimeField('%Y-%m-%d %H:%M:%S', read_only=True)
    count_used = serializers.IntegerField(read_only=True)

    def create(self, validate_data):
        tag_ids = validate_data.pop('tag_ids', [])
        default_status = StatusModel.objects.filter(default=True).first()
        note = NoteModel(**validate_data)
        note.status = default_status
        note.save()
        if tag_ids:
            note.tags.set(tag_ids)
        return note