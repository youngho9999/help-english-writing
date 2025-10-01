import nltk
import ssl

try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    # Python 2.7.9 미만 버전에서는 이 방법이 통하지 않음
    pass
else:
    # SSL 인증서 검증을 비활성화하는 컨텍스트를 기본값으로 설정
    ssl._create_default_https_context = _create_unverified_https_context

# 이제 데이터를 다운로드합니다.
nltk.download()

print("다운로드가 완료되었습니다! 이제 main 파일을 실행하세요.")