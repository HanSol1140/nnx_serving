# 마우스를 갓다댄곳에 픽셀기준 좌표를 출력

import matplotlib.pyplot as plt
import matplotlib.image as mpimg

# 이미지 로드
image_path = "C:\\songhansol\\nnx_serving\\mapTest\\map.png"
img = mpimg.imread(image_path)

# 클릭 이벤트 처리 함수
def on_click(event):
    if event.inaxes:
        x, y = event.xdata, event.ydata
        print(f"Clicked at: ({x}, {y})")

# 이미지 표시 및 이벤트 처리 설정
fig, ax = plt.subplots()
ax.imshow(img)
fig.canvas.mpl_connect('button_press_event', on_click)
plt.show()
