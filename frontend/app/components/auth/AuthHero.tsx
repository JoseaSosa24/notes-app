// frontend/app/components/auth/AuthHero.tsx
interface AuthHeroProps {
  title: string
  description: string
  backgroundImage: string
}

export default function AuthHero({ title, description, backgroundImage }: AuthHeroProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-primary-800/90" />
      <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6">{title}</h1>
          <p className="text-xl opacity-90 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}