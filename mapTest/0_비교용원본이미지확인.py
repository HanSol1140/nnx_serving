import cv2
import matplotlib.pyplot as plt
import numpy as np
# 이미지 로드
image_path = "C:\\songhansol\\nnx_serving\\mapTest\\map.png"
image = cv2.imread(image_path)

# 이진화된 이미지 표시
plt.imshow(image, cmap='gray')
plt.axis('off')
plt.show()