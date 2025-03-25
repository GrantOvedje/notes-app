import React, { useState } from 'react'
import Navbar from '../../components/Navbar/navbar'
import NoteCard from '../../components/cards/NoteCard'
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import axiosInstance from '../../utils/axiosIntance';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Notification from '../../components/NotificationMessage/Notification';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import AddFile from '../../assets/images/Add-file.svg';
import EmptyFile from '../../assets/images/Empty-file.svg';

function Home() {
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showNotificationMsg, setShowNotificationMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

   const [allNotes, setAllNotes] = useState([]);
   const [userInfo, setUserInfo] = useState(null);

   const [isSearch, setIsSearch] = useState(false);

   const navigate = useNavigate();

  const handleEdit = (noteDetails)=>{
    setOpenAddEditModel({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showNotificationMessage = (message, type)=>{
    setShowNotificationMsg({
      isShown: true,
      message,
      type,

    });
  };

  const handleCloseNotification = ()=>{
    setShowNotificationMsg({
      isShown: false,
      message: "",
    });
  };

  // Get user Info
  const getUserInfo = async ()=>{
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401){
        localStorage.clear();
        navigate("/login");
      }
    }
  };

   // Get notes
   const getAllNotes = async ()=>{
    try {
      const response = await axiosInstance.get("/get-all-notes/");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again.")
    }
  }

  // Delete Notes
  const deleteNote = async (data)=> {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.data && !response.data.error){
        showNotificationMessage("Note Deleted Successfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      if(
        error.response && 
        error.response.data &&
        error.response.data.message
      ){
        console.log("An unexpected error occured. Please try again.");
      };
    };
  };

  // Search for a note
  const onSearchNote = async (query) =>{
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Updating IsPinned 
  const updateIsPinned = async (noteData) => {
     const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/update-note-pinned/" + noteId, 
      {
        isPinned: !noteData.isPinned,
      }
    );

      if (response.data && response.data.note){
        showNotificationMessage("Note Updated Successfully");
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  }

  useEffect(()=>{
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);


  return (
    <>
      <Navbar 
        userInfo={userInfo} 
        onSearchNote={onSearchNote} 
        handleClearSearch={handleClearSearch}
      />
      
      <div className='container mx-auto'>
        
        {allNotes.length > 0 ? (
        <div className='grid grid-cols-3 gap-4 mt-8'>
            {allNotes.map((item, index) =>(
          <NoteCard 
            key={item._id}
            title={item.title}
            date={item.createdOn}
            content={item.content}
            tags={item.tags}
            isPinned={item.isPinned}
            onEdit={()=> handleEdit(item)}
            onDelete={()=> deleteNote(item)}
            onPinNote={()=> updateIsPinned(item)}
          />
        )) }
        </div>
        ) : (
            <EmptyCard 
              imgSrc={isSearch ? EmptyFile : AddFile} 
              message={isSearch ? "Oops! No notes matching your search." : "Start creating your first note! Click on the 'Add' button to jot down your thoughts, ideas, and reminders, let's get started!"}
            />
        )}
       
      </div>

      <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10' 
        onClick={()=> {
          setOpenAddEditModel({ isShown: true, type: "add", data: null})
        }}>
        <MdAdd className='text-[32px] text-white'/>
      </button>

      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={()=> {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5"
      >
        <AddEditNotes 
          type={openAddEditModel.type}
          noteData={openAddEditModel.data}
          onClose={()=>{
            setOpenAddEditModel({isShown: false, type: "add", data: null});
          }}
          getAllNotes={getAllNotes}
          showNotificationMessage={showNotificationMessage}
        />
      </Modal>

      <Notification 
        isShown={showNotificationMsg.isShown}
        message={showNotificationMsg.message}
        type={showNotificationMsg.type}
        onClose={handleCloseNotification}
      />
    </>
  );
};

export default Home
