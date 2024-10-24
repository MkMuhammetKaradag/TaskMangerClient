import { FC } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const CloseButton: FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="absolute top-0 right-0 z-50 justify-end ">
    <button
      onClick={onClick}
      className=" bg-black rounded-full text-gray-100 xl:bg-transparent xl:text-white text-3xl"
    >
      <AiOutlineClose />
    </button>
  </div>
);
export default CloseButton;
