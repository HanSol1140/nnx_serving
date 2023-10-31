import PIL.Image
import numpy as np
# NumPy 출력 옵션 설정
np.set_printoptions(threshold=np.inf, linewidth=np.inf)
# png 파일을 읽습니다.
img = PIL.Image.open("C:\\songhansol\\nnx_serving\\mapTest\\map.png")

# 픽셀 데이터를 분석합니다.
data = []
for x in range(img.size[0]):
  row = []
  for y in range(img.size[1]):
    pixel = img.getpixel((x, y))

    # 픽셀이 흰색이면 1, 검은색이면 0으로 변환합니다.
    if pixel == 0:
      row.append(1)
    else:
      row.append(0)
  data.append(row)

# Map 데이터를 출력합니다.
print(data)
np.savetxt('2_map.txt', data, fmt='%d')