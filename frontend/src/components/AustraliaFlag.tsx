import flagImg from '../assets/AustraliaFlag.jpg';

export default function AustraliaFlag({ className = '' }: { className?: string }) {
  return <img src={flagImg} alt="Flag of Australia" className={className} />;
}
