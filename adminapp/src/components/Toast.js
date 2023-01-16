import { ToastContainer, Toast } from 'react-bootstrap'

const ToastNotification = ({ msg, success, open, setOpenNotification }) => {
    return (
        <ToastContainer position="top-end" className="p-3" style={{ marginTop: '40px' }}>
            <Toast className="d-inline-block m-1" bg={success !== '' ? 'success' : 'danger'}
                onClose={() => setOpenNotification(false)} show={open} delay={5000} autohide>
                {/* <Toast.Header>
                    <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                    <strong className="me-auto">{header}</strong>
                </Toast.Header> */}
                <Toast.Body >
                    {success !== '' ? success : msg}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    )
}

export default ToastNotification