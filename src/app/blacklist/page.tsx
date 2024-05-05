import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Blacklist() {
  return (
    <div className='flex justify-center pt-[10vh]'>
      <div className='bg-white p-5 rounded-md flex flex-col justify-center items-center'>
        <div className='mb-4'>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className='text-muted w-20 h-20'
          />
        </div>
        <p>Apologise for the inconvinience. We are not open to public yet.</p>
        <a target='_blank' href='https://discord.com/channels/902577845799362591/1235306842914029578'>
          Please click here to request to whitelist your address and mint your
          products using Locki3D.
        </a>
      </div>
    </div>
  );
}
