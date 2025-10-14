from django.core.exceptions import ValidationError
from django.shortcuts import render
from django.http import HttpRequest

from rest_framework import status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view

from .models import NoteModel, SubjectModel, TagModel, StatusModel
from .serializers import NoteSerializer, SubjectSerializer, TagSerializer, StatusSerializer

@api_view(['GET', 'POST'])
def get_lessons(request: HttpRequest):
    if request.method == 'GET':
        notes = NoteModel.objects.all()
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)
    if request.method == 'POST':
        try:
            serializer = NoteSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({'errors': serializer.error_messages}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({'errors': list(e)}, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET'])
def get_subjects(request: HttpRequest):
    if request.method == 'GET':
        subjects = SubjectModel.objects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def get_tags(request: HttpRequest):
    if request.method == 'GET':
        tags = TagModel.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def get_statuses(request: HttpRequest):
    if request.method == 'GET':
        statuses = StatusModel.objects.all()
        serializer = StatusSerializer(statuses, many=True)
        return Response(serializer.data)
    
    
    
    