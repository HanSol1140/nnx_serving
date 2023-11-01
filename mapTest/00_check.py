import cv2
# 두 이미지 불러오기
image_binary = cv2.imread("C:\\songhansol\\nnx_serving\\mapTest\\binary_image.png")
image_map = cv2.imread("C:\\songhansol\\nnx_serving\\mapTest\\map.png")

# 각 이미지의 크기 출력
print("Binary image size:", image_binary.shape)
print("Map image size:", image_map.shape)
