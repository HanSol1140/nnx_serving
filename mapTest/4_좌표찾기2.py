# 4개의 지점을 찍으면 중앙점을 찾아서 출력함
import matplotlib.pyplot as plt
import matplotlib.image as mpimg

# 이미지 로드
image_path = "C:\\songhansol\\nnx_serving\\mapTest\\map.png"
img = mpimg.imread(image_path)

# 클릭한 좌표를 저장할 리스트
clicked_points = []

# 클릭 이벤트 처리 함수
def on_click(event):
    if event.inaxes:
        x, y = event.xdata, event.ydata
        clicked_points.append((x, y))
        print(f"Clicked at: ({x}, {y})")
        
        # 4개의 포인트가 모두 클릭되었을 때 (0, 0) 찾기
        if len(clicked_points) == 4:
            find_origin(clicked_points)

# (0, 0)의 위치를 찾는 함수
def find_origin(points):
    # 4개의 포인트를 바탕으로 직사각형의 중심을 찾아 (0, 0)으로 설정
    x_coords, y_coords = zip(*points)
    origin_x = sum(x_coords) / 4
    origin_y = sum(y_coords) / 4
    print(f"Origin (0, 0) is estimated at: ({origin_x}, {origin_y})")

# 이미지 표시 및 이벤트 처리 설정
fig, ax = plt.subplots()
ax.imshow(img)
fig.canvas.mpl_connect('button_press_event', on_click)
plt.show()
