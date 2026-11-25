from pyramid.httpexceptions import HTTPBadRequest


def json_object(request):
    try:
        data = request.json_body
    except (ValueError, TypeError):
        raise HTTPBadRequest(json_body={'error': 'Body harus berupa JSON yang valid.'})
    if not isinstance(data, dict):
        raise HTTPBadRequest(json_body={'error': 'Body JSON harus berupa object.'})
    return data
