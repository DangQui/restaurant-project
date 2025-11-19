import { useState } from 'react'
import Button from '@/components/Button/Button'
import styles from './Reservation.module.scss'

const initialForm = {
  name: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
  note: '',
}

const ReservationPage = () => {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ submitting: false, success: null, error: null })

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setStatus({
      submitting: true,
      error: null,
      success: null,
    })

    setTimeout(() => {
      setStatus({
        submitting: false,
        error: null,
        success: 'Cảm ơn bạn! Bộ phận lễ tân sẽ liên hệ trong ít phút tới.',
      })
      setForm(initialForm)
    }, 600)
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className="pill">Đặt bàn</span>
        <h1>Giữ chỗ trước để tận hưởng trọn vẹn</h1>
        <p>
          Vui lòng để lại thông tin liên hệ, thời gian mong muốn và số khách. Chúng tôi sẽ xác nhận đặt bàn hoặc gợi ý
          khung giờ phù hợp nhất cho bạn.
        </p>
      </section>

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Họ tên *
            <input value={form.name} onChange={(event) => handleChange('name', event.target.value)} required />
          </label>
          <label>
            Số điện thoại *
            <input value={form.phone} onChange={(event) => handleChange('phone', event.target.value)} required />
          </label>
          <label>
            Ngày
            <input type="date" value={form.date} onChange={(event) => handleChange('date', event.target.value)} />
          </label>
          <label>
            Khung giờ
            <input type="time" value={form.time} onChange={(event) => handleChange('time', event.target.value)} />
          </label>
          <label>
            Số khách
            <input
              type="number"
              min={1}
              value={form.guests}
              onChange={(event) => handleChange('guests', Number(event.target.value))}
            />
          </label>
          <label>
            Ghi chú
            <textarea rows={3} value={form.note} onChange={(event) => handleChange('note', event.target.value)} />
          </label>
          {status.error ? <p className={styles.error}>{status.error}</p> : null}
          {status.success ? <p className={styles.success}>{status.success}</p> : null}
          <Button type="submit" disabled={status.submitting}>
            {status.submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </Button>
        </form>

        <aside className={styles.info}>
          <h2>Tổng đài đặt bàn</h2>
          <p>Hoạt động 9:00 - 22:00 mỗi ngày.</p>
          <ul>
            <li>
              <span>Điện thoại</span>
              <strong>1900 636 678</strong>
            </li>
            <li>
              <span>Email</span>
              <strong>booking@wowwraps.vn</strong>
            </li>
            <li>
              <span>Địa chỉ</span>
              <strong>18 Ngô Quyền, Hoàn Kiếm, Hà Nội</strong>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  )
}

export default ReservationPage




