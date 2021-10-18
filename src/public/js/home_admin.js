const testimonialsContainer = document.querySelector('.testimonials-container')
const testimonial = document.querySelector('.testimonial')

const testimonials = [
  {
    text : "Đừng nghĩ mãi về quá khứ. Nó chỉ mang tới những giọt nước mắt. Đừng nghĩ nhiều về tương lai. Nó chỉ mang lại lo sợ. SỐNG Ở HIỆN TẠI VỚI NỤ CƯỜI TRÊN MÔI. Nó sẽ mang lại niềm vui cho bạn."
  },
  {
    text : "Mỗi khi mỏi bước trên con đường mình đã chọn, hãy tự nhủ mình: “Tiếp tục đi… đừng dừng lại. Mỗi bước có thể khó khăn hơn nhưng đừng dừng lại. Viễn cảnh đẹp nhất là lúc ở trên đỉnh”."
  },
  {
    text : "Không cần biết mọi thứ khó khăn đến đâu, hãy luôn vững bước mà tiến lên. Bạn chỉ thật sự thất bại một khi bạn từ bỏ mọi cố gắng. Đối lập với chiến thắng không phải là thất bại mà chính là từ bỏ."
  },
  {
    text : "Hãy nhìn xuống để thấy rằng cuộc đời này ta còn may mắn hơn biết bao nhiêu người. Và hãy nhìn lên để thấy rằng cuộc đời này ta cần phải cố gắng nhiều hơn nữa."
  },
  {
    text : "Hạnh phúc không tuỳ thuộc vào bạn là ai, bạn làm gì mà tùy thuộc vào bạn nghĩ gì."
  },
  {
    text : "Đừng đánh mất bản thân mình khi cố gắng níu giữ người mà không hề quan tâm tới việc sắp mất bạn. Hãy là chính mình!"
  },
  {
    text : "Nghĩ quá nhiều sẽ hủy hoại bạn. Hủy hoại thực tại, thay đổi mọi thứ xung quanh, khiến bạn lo lắng và làm mọi thứ trở nên tồi tệ hơn bạn nghĩ. Đừng nghĩ quá nhiều!"
  }
]

let idx = 1

function updateTestimonial() {
  const {text } = testimonials[idx]

  testimonial.innerHTML = text

  idx++

  if (idx > testimonials.length - 1) {
    idx = 0
  }
}

setInterval(updateTestimonial, 10000)