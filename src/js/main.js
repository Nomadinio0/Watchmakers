const footerYear = document.querySelector('.footer__year')
const galleryBig = document.querySelectorAll('gallery-img')

const zoomImg = () => {
	
}

const handleCurrentYear = () => {
	const year = new Date().getFullYear()
	footerYear.innerText = year
}

galleryBig.addEventListener('click', zoomImg)
handleCurrentYear()
