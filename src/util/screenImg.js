import html2canvas from "html2canvas"

export default function (id) {
	
	// 获取容器
	let element = document.getElementById(id)
	// 创建canvas对象
	let canvas = document.createElement("canvas")

	// 放大基数
	let scale = 1

	canvas.width = element.offsetWidth * scale
	canvas.height = element.offsetHeight * scale


	html2canvas(element, {
		dpi: window.devicePixelRatio * scale,
		scale: scale,
		canvas: canvas,
		width: element.offsetWidth,
		heigth: element.offsetHeight,
		useCORS: true
	}).then(function (canvas) {

		let dataImg = new Image()
		dataImg.src = canvas.toDataURL('image/png', 1.0)
		let alink = document.createElement("a")
		alink.href = dataImg.src
		alink.download = "KMRS.jpg"
		alink.click()

	})
}
