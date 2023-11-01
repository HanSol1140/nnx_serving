import cv2
import matplotlib.pyplot as plt
import numpy as np
# 이미지 로드
image_path = "C:\\songhansol\\nnx_serving\\mapTest\\map.png"
image = cv2.imread(image_path)

# 원본 이미지의 크기 출력
if image is not None:
    print("Original image size:", image.shape)
else:
    print("Error: Unable to load image. Check the file path.")
    exit()

# BGR에서 GRAY로 색상 공간 변환
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
print("Gray image size:", gray_image.shape)

# 이진화 (임계값 127을 기준으로 0 또는 255로 설정)
_, binary_image = cv2.threshold(gray_image, 127, 255, cv2.THRESH_BINARY)
print("Binary image size:", binary_image.shape)

# 이진화된 이미지 저장
output_path = 'binary_image.png'
cv2.imwrite(output_path, binary_image)
print("Binary image saved at:", output_path)

# 이진화된 이미지 표시
plt.imshow(binary_image, cmap='gray')
plt.axis('off')
plt.show()


# 이진화된 이미지 데이터를 0과 1로 변환
binary_data = (binary_image / 255).astype(int)

# 이진 데이터 저장
np.savetxt('binary_data.txt', binary_data, fmt='%d')
print("Binary data saved at: binary_data.txt")