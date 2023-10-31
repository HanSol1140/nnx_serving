import numpy as np
from PIL import Image

def extract_message_from_image(image_path):
    # 이미지 로드
    image = Image.open(image_path)
    image_array = np.array(image)

    # 이미지 배열에서 메시지 추출
    flat_image_array = image_array.flatten()
    binary_message = ''
    for i in range(flat_image_array.size):
        binary_message += str(flat_image_array[i] & 1)
        # if binary_message.endswith('11111111111110'):
            # break

    # 이진 데이터를 텍스트로 변환
    binary_message = binary_message[:-16]  # 메시지 끝 표시자 제거
    message = ''
    for i in range(0, len(binary_message), 8):
        byte = binary_message[i:i+8]
        message += chr(int(byte, 2))
    return message

# 이미지 파일 경로
image_path = "C:\\songhansol\\nnx_serving\\mapTest\\hidden_image.png"

# 메시지 추출
message = extract_message_from_image(image_path)
print("Hidden Message:", message.encode('utf-8'))

