# 마우스를 갓다댄곳에 픽셀기준 좌표를 출력
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
    # 직사각형의 변의 중점 찾기
    midpoints = [
        ((points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2),
        ((points[1][0] + points[3][0]) / 2, (points[1][1] + points[3][1]) / 2),
        ((points[2][0] + points[3][0]) / 2, (points[2][1] + points[3][1]) / 2),
        ((points[0][0] + points[2][0]) / 2, (points[0][1] + points[2][1]) / 2)
    ]
    
    # 중점들을 연결하여 (0, 0) 찾기 (교차하는 지점)
    origin_x = (midpoints[0][0] + midpoints[2][0]) / 2
    origin_y = (midpoints[1][1] + midpoints[3][1]) / 2
    
    print(f"Origin (0, 0) is estimated at: ({origin_x}, {origin_y})")

# 이미지 표시 및 이벤트 처리 설정
fig, ax = plt.subplots()
ax.imshow(img)
fig.canvas.mpl_connect('button_press_event', on_click)
plt.show()
