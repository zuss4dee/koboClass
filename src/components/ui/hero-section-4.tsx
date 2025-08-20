'use client'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { cn } from '@/lib/utils'
import { Menu, X, MoveRight, PhoneCall } from 'lucide-react'

export function HeroSection() {
    return (
        <>
            <main className="overflow-x-hidden">
                <section>
                    <div className="pb-12 pt-20 md:pb-16 md:pt-24 lg:pb-24 lg:pt-32 bg-gradient-to-br from-creamy-white via-light-sand to-golden-yellow/20">
                        <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="mx-auto max-w-lg text-center lg:ml-0 lg:text-left">
                                    <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-7xl">
                                        <span className="inline-block text-deep-orange transform -rotate-3 hover:rotate-0 transition-transform duration-500 relative">
                                            <span className="inline-block transform hover:scale-110 transition-transform duration-300" style={{
                                                background: 'linear-gradient(45deg, #D9572B, #F4B400, #C1440E)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                                textShadow: '0 4px 8px rgba(217, 87, 43, 0.3)'
                                            }}>
                                                Learn
                                            </span>
                                        </span> practical skills from real people
                                    </h1>
                                    <p className="mt-8 max-w-2xl text-pretty text-lg text-charcoal-black">
                                        KoboClass connects you to live, affordable classes taught by Nigerian creatives. 
                                        From tech to makeup to music - learn skills that actually pay.
                                    </p>

                                    <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                                        <Link to="/signup" replace>
                                            <Button
                                            size="lg"
                                            className="px-5 text-base gap-4 gradient-orange-yellow text-on-gradient hover:opacity-90 border-0"
                                            >
                                            <span className="text-nowrap">Start Learning</span>
                                            <MoveRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            key={2}
                                            size="lg"
                                            variant="outline"
                                            className="px-5 text-base gap-4 border-2 border-forest-green text-forest-green hover:bg-forest-green hover:text-creamy-white"
                                            asChild>
                                        <Link to="/signup?redirect=host" replace>
                                            <span className="text-nowrap">Host a Class</span>
                                            <PhoneCall className="w-4 h-4" />
                                        </Link>
                                        </Button>
                                    </div>
                                </div>
                                
                                {/* Right Image */}
                                <div className="relative">
                                    <img 
                                        src="/image 1.png" 
                                        alt="Nigerian creatives learning and teaching online"
                                        className="w-full h-auto rounded-2xl shadow-2xl"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-rich-plum/10 to-transparent rounded-2xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-light-sand pb-16 md:pb-32">
                    <div className="group relative m-auto max-w-6xl px-6">
                        <div className="flex flex-col items-center md:flex-row">
                            <div className="md:max-w-44 md:border-r md:pr-6">
                                <p className="text-end text-sm text-warm-gray">Powering Nigeria's creative economy</p>
                            </div>
                            <div className="relative py-6 md:w-[calc(100%-11rem)]">
                                <InfiniteSlider
                                    speedOnHover={20}
                                    speed={40}
                                    gap={112}>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit dark:invert"
                                            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Paystack_Logo.png"
                                            alt="Paystack"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>

                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit dark:invert"
                                            src="https://flutterwave.com/images/logo/full.svg"
                                            alt="Flutterwave"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit dark:invert"
                                            src="https://andela.com/wp-content/uploads/2021/08/andela-logo-landscape-blue-400px.png"
                                            alt="Andela"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit dark:invert"
                                            src="https://www.konga.com/static/images/logo.png"
                                            alt="Konga"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit dark:invert"
                                            src="https://logos-world.net/wp-content/uploads/2021/02/Jumia-Logo.png"
                                            alt="Jumia"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit dark:invert"
                                            src="https://www.interswitchgroup.com/assets/images/interswitch-logo.svg"
                                            alt="Interswitch"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-5 w-fit dark:invert"
                                            src="https://opay.com/static/images/logo.png"
                                            alt="OPay"
                                            height="20"
                                            width="auto"
                                        />
                                    </div>
                                    <div className="flex">
                                        <img
                                            className="mx-auto h-4 w-fit dark:invert"
                                            src="https://www.gtbank.com/images/gtbank-logo.png"
                                            alt="GTBank"
                                            height="16"
                                            width="auto"
                                        />
                                    </div>
                                </InfiniteSlider>

                                <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                                <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                                <ProgressiveBlur
                                    className="pointer-events-none absolute left-0 top-0 h-full w-20"
                                    direction="left"
                                    blurIntensity={1}
                                />
                                <ProgressiveBlur
                                    className="pointer-events-none absolute right-0 top-0 h-full w-20"
                                    direction="right"
                                    blurIntensity={1}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}