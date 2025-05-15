from typing import List, Type


class BaseError(Exception):

    status_code: int = 400
    detail: str = "Bad Request"

    def __init__(self, message: str = None):
        self.message = message or self.default_message
        super().__init__(self.message)

    def __str__(self):
        return self.message


class InvalidParameter(BaseError):
    status_code = 400
    detail = "Invalid Parameter"


class AccessDenied(BaseError):
    status_code = 403
    detail = "Access Denied"


class AccessTokenExpired(BaseError):
    status_code = 403
    detail = "Access Token Expired"


class AccessTokenInvalid(BaseError):
    status_code = 403
    detail = "Access Token Invalid"


class NotFound(BaseError):
    status_code = 404
    detail = "Not Found"


class Conflict(BaseError):
    status_code = 409
    detail = "Conflict"


class InternalServerError(BaseError):
    status_code = 500
    detail = "Internal Server Error"


def error_response(error_types: List[Type[BaseError]]) -> dict:
    d = {}
    for et in error_types:
        if not d.get(et.status_code):
            d[et.status_code] = {
                'description': f'{et.detail}',
                'content': {
                    'application/json': {
                        'example': {
                            'message': f'{et.detail}'
                        }
                    }
                }
            }
        else:
            d[et.status_code]['description'] += f'<br>, {et.detail}'
    return d