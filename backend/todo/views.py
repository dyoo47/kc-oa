from django.http import HttpResponse
from django.http import JsonResponse
from django.core import serializers
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import Item
from django.utils import timezone
import json


def index(request):
    response = serializers.serialize("json", Item.objects.all())
    return HttpResponse(response, content_type="application/json")

@csrf_exempt
@require_POST
def update(request):
    try:
        data = json.loads(request.body)
        item_id = data.get('item_id')
        is_done = data.get('is_done')
        if not isinstance(is_done, bool):
          return HttpResponse('Invalid value for is_done.', status=400)
        item = get_object_or_404(Item, pk=item_id)
        item.is_done = is_done
        item.save()
        return HttpResponse('Successfully updated item.')
    except Exception as e:
        return HttpResponse(str(e), status=500)

@csrf_exempt
@require_POST
def add(request):
    try:
        data = json.loads(request.body)
        label = data.get('label_text')
        item = Item(label_text=label, added_date=timezone.now(), is_done=False)
        item.save()
        return JsonResponse({'id': item.pk})
    except Exception as e:
        return HttpResponse(str(e), status=500)