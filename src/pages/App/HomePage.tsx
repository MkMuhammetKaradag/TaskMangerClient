import { useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { LOGOUT_USER } from '../../graphql/mutations/Auth/Logout';
import { useAppDispatch } from '../../redux/hooks';
import { logout } from '../../redux/slices/AuthSlice';
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import Draggable from 'react-draggable';

const boxStyle = {
  border: 'grey solid 2px',
  borderRadius: '10px',
  padding: '5px',
};

const DraggableBox = ({ id }: { id: string }) => {
  const updateXarrow = useXarrow();
  return (
    <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
      <div id={id} style={boxStyle}>
        {id}
      </div>
    </Draggable>
  );
};
const HomePage = () => {
  const [logoutUser] = useMutation(LOGOUT_USER);
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  useEffect(() => {
    console.log('hello');
  }, []);

  return (
    <div>
      HomePage
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-700"
        onClick={() => {
          handleLogout();
        }}
      >
        Çıkış Yap
      </button>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          width: '100%',
        }}
      >
        <Xwrapper>
          <DraggableBox id={'elem1'} />
          <DraggableBox id={'elem2'} />
          <Xarrow start={'elem1'} end="elem2" />
        </Xwrapper>
      </div>
    </div>
  );
};

export default HomePage;
