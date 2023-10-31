import cv2
import numpy as np

# 작업폴더 확인
import os
print("Working Directory:", os.getcwd())

# NumPy 출력 옵션 설정
np.set_printoptions(threshold=np.inf, linewidth=np.inf)

# png 파일을 읽습니다.
img = cv2.imread("C:\\songhansol\\nnx_serving\\mapTest\\map.png")

# 파일을 읽지 못했을 경우 오류 메시지 출력
if img is None:
    print("Error: Unable to load image. Check the file path.")
else:
    # 픽셀 데이터를 분석합니다.
    data = np.zeros_like(img[:, :, 0])  # img와 같은 크기의 2D 배열 생성
    for x in range(img.shape[0]):
        for y in range(img.shape[1]):
            pixel = img[x, y]

            # 픽셀이 흰색이면 1, 검은색이면 0으로 변환합니다.
            if pixel[0] == 255 and pixel[1] == 255 and pixel[2] == 255:
                data[x, y] = 1
            else:
                data[x, y] = 0

    # Map 데이터를 출력합니다.
    print(data)
    np.savetxt('1_map.txt', data, fmt='%d')