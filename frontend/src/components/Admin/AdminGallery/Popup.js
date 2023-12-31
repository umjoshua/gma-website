import React, { useState } from 'react';
import './styles.css';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import * as api from '../../../api';
import FileBase from 'react-file-base64';

const GalleryPopup = ({ gallery, setGallery }) => {

    const [isOpen, setIsOpen] = useState(false);

    const [imageData, setimageData] = useState({});

    const [loading, setLoading] = useState(false);

    const [addError, setAddError] = useState(null);

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        }
    };

    const postdata = async () => {
        setLoading(true);
        try {
            const { data } = await api.addGalleryImage(imageData, config);
            if (data) {
                setGallery(data);
                setIsOpen(false);
            }
        } catch (error) {
            setAddError('Failed to add image. Please try again later.');
        }
        setLoading(false);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        postdata();
    }

    const togglePopup = () => {
        setIsOpen(!isOpen);
        setimageData({});
    };

    return (
        <div className="popup-container">
            <div className="add_event_icon" onClick={togglePopup} style={{ visibility: isOpen ? "hidden" : "visible", background: 'green' }}>
                <AddIcon style={{ color: "white" }} />
            </div>
            {isOpen && (

                <div className="popup">
                    <div className='gp-1'>
                        <h2>Add Gallery Image</h2>
                        <CloseIcon style={{ cursor: 'pointer', backgroundColor: 'red', borderRadius: '50px' }}
                            onClick={togglePopup} />
                    </div>
                    <form className='form-input' style={{ marginTop: "20px" }} onSubmit={handleSubmit}>
                        <FileBase type="file" multiple={false} onDone={({ base64 }) => setimageData({ file: base64 })} />
                        {imageData.file && <img src={imageData.file} alt='preview' height={100}></img>}
                        <input type="submit"
                            style={
                                { backgroundColor: 'green', color: 'white', marginTop: "10px", height: '30px' }
                            }
                        />
                        {addError && <p className='add-error' style={{ color: 'red' }}>{addError}</p>}
                    </form>
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </div>
            )
            }
        </div >
    );
};

export default GalleryPopup;
