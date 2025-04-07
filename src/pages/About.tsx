
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  Lightbulb, 
  Heart, 
  Star,
  Gift,
  CircleHelp
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col islamic-pattern-bg">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">About Noor Play & Learn</h1>
          <p className="text-xl text-muted-foreground mb-8 text-center">
            Our mission is to make learning about Islamic traditions fun and engaging for everyone.
          </p>
          
          <Tabs defaultValue="about">
            <TabsList className="w-full mb-8">
              <TabsTrigger value="about">
                <BookOpen className="h-4 w-4 mr-2" />
                Our Story
              </TabsTrigger>
              <TabsTrigger value="mission">
                <Lightbulb className="h-4 w-4 mr-2" />
                Our Mission
              </TabsTrigger>
              <TabsTrigger value="team">
                <Users className="h-4 w-4 mr-2" />
                Our Team
              </TabsTrigger>
              <TabsTrigger value="faq">
                <CircleHelp className="h-4 w-4 mr-2" />
                FAQ
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>Our Story</CardTitle>
                  <CardDescription>How Noor Play & Learn came to be</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Noor Play & Learn was created from a desire to make Islamic education more engaging and accessible. 
                    We noticed that while there were many educational resources available, few made learning truly fun 
                    and interactive.
                  </p>
                  <p>
                    Our team of educators, game designers, and Islamic scholars came together to create games that 
                    not only entertain but also educate players about Islamic traditions, history, and teachings.
                  </p>
                  <p>
                    We started with a focus on Ramadan activities for children, but quickly expanded to include games 
                    for all ages and covering a wide range of Islamic topics. Today, we're proud to offer a comprehensive 
                    suite of games that make learning about Islam a joyful experience.
                  </p>
                  
                  <div className="mt-8 flex justify-center">
                    <img 
                      src="/lovable-uploads/2b86eda0-bae3-4351-aca1-350d4bfa1479.png" 
                      alt="Islamic educational games" 
                      className="w-full max-w-md rounded-xl shadow-md"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mission">
              <Card>
                <CardHeader>
                  <CardTitle>Our Mission</CardTitle>
                  <CardDescription>What drives us forward</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="flex-1 p-4 border rounded-xl bg-islamic-primary/5 flex flex-col items-center text-center">
                      <Heart className="h-10 w-10 text-islamic-primary mb-3" />
                      <h3 className="font-bold mb-2">Make Learning Fun</h3>
                      <p className="text-sm text-muted-foreground">
                        We believe that learning happens best when it's enjoyable. Our games are designed to be fun first, with education seamlessly integrated.
                      </p>
                    </div>
                    
                    <div className="flex-1 p-4 border rounded-xl bg-islamic-secondary/5 flex flex-col items-center text-center">
                      <Star className="h-10 w-10 text-islamic-secondary mb-3" />
                      <h3 className="font-bold mb-2">Accessible Education</h3>
                      <p className="text-sm text-muted-foreground">
                        We strive to make Islamic education accessible to everyone, regardless of age, background, or level of knowledge.
                      </p>
                    </div>
                    
                    <div className="flex-1 p-4 border rounded-xl bg-islamic-accent/5 flex flex-col items-center text-center">
                      <Gift className="h-10 w-10 text-islamic-accent mb-3" />
                      <h3 className="font-bold mb-2">Foster Community</h3>
                      <p className="text-sm text-muted-foreground">
                        We aim to build a community of learners who share knowledge and celebrate Islamic traditions together.
                      </p>
                    </div>
                  </div>
                  
                  <p>
                    At Noor Play & Learn, we're committed to creating a world where learning about Islam is a joyful journey 
                    of discovery. We believe that education should be engaging, accessible, and meaningful.
                  </p>
                  <p>
                    Our games are designed with careful attention to cultural sensitivity, educational value, and user experience. 
                    We work closely with Islamic scholars to ensure the accuracy of our content while maintaining a focus on making 
                    learning fun.
                  </p>
                  <p>
                    As we grow, we remain dedicated to our core mission: making Islamic education enjoyable for everyone, 
                    fostering a love of learning, and building a community of knowledgeable, engaged Muslims and those interested 
                    in learning about Islamic traditions.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Our Team</CardTitle>
                  <CardDescription>The people behind Noor Play & Learn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center text-center p-4 border rounded-xl">
                      <div className="w-24 h-24 rounded-full bg-islamic-primary flex items-center justify-center text-white mb-4">
                        <span className="text-2xl font-bold">A</span>
                      </div>
                      <h3 className="text-xl font-bold">Aisha Rahman</h3>
                      <p className="text-sm text-muted-foreground mb-2">Founder & Educational Director</p>
                      <p className="text-sm">
                        Former teacher with a passion for making Islamic education accessible and engaging for children.
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center p-4 border rounded-xl">
                      <div className="w-24 h-24 rounded-full bg-islamic-secondary flex items-center justify-center text-white mb-4">
                        <span className="text-2xl font-bold">Y</span>
                      </div>
                      <h3 className="text-xl font-bold">Yusuf Khan</h3>
                      <p className="text-sm text-muted-foreground mb-2">Lead Game Designer</p>
                      <p className="text-sm">
                        Experienced game designer with a background in educational technology and a love for Islamic history.
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center p-4 border rounded-xl">
                      <div className="w-24 h-24 rounded-full bg-islamic-accent flex items-center justify-center text-white mb-4">
                        <span className="text-2xl font-bold">F</span>
                      </div>
                      <h3 className="text-xl font-bold">Fatima Ali</h3>
                      <p className="text-sm text-muted-foreground mb-2">Islamic Content Specialist</p>
                      <p className="text-sm">
                        Islamic studies graduate with expertise in making complex Islamic concepts accessible to all ages.
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center p-4 border rounded-xl">
                      <div className="w-24 h-24 rounded-full bg-islamic-gold flex items-center justify-center text-white mb-4">
                        <span className="text-2xl font-bold">O</span>
                      </div>
                      <h3 className="text-xl font-bold">Omar Hassan</h3>
                      <p className="text-sm text-muted-foreground mb-2">UX Designer</p>
                      <p className="text-sm">
                        User experience expert focused on creating intuitive, accessible games for players of all ages.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <h3 className="text-xl font-bold mb-4">Our Advisors</h3>
                    <p className="mb-6">
                      We work with a group of respected Islamic scholars and educational experts who review our content and provide guidance.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4">
                      {["Dr. Amina Siddiqui", "Sheikh Ibrahim Nur", "Prof. Layla Ahmed", "Dr. Mohammed Kareem"].map((advisor, index) => (
                        <div key={index} className="bg-card px-4 py-2 rounded-full border text-sm">
                          {advisor}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>Common questions about Noor Play & Learn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        question: "Is Noor Play & Learn suitable for all ages?",
                        answer: "Yes! We have games designed for various age groups and knowledge levels. Our games are categorized by difficulty, so you can choose what's appropriate for you or your child."
                      },
                      {
                        question: "Do I need to have prior knowledge of Islam to play?",
                        answer: "Not at all. Our games are designed to be educational and start from the basics. You'll learn as you play, making it perfect for beginners and those looking to expand their knowledge."
                      },
                      {
                        question: "Are the games available on mobile devices?",
                        answer: "Yes, our platform is fully responsive and works on smartphones, tablets, and desktop computers."
                      },
                      {
                        question: "Is the content reviewed by Islamic scholars?",
                        answer: "Absolutely. All our educational content is reviewed by qualified Islamic scholars to ensure accuracy and authenticity."
                      },
                      {
                        question: "How often do you add new games?",
                        answer: "We regularly update our collection with new games and activities. We also release special game collections during Islamic holidays like Ramadan and Eid."
                      },
                      {
                        question: "Can I suggest ideas for new games?",
                        answer: "We love hearing from our community! You can send your suggestions through the Contact section of our website."
                      }
                    ].map((faq, index) => (
                      <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
                        <h3 className="font-bold mb-2">{faq.question}</h3>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 bg-islamic-primary/10 p-6 rounded-xl">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-islamic-primary" />
                      Still have questions?
                    </h3>
                    <p className="mb-4">We're here to help! Reach out to us and we'll get back to you as soon as possible.</p>
                    <Button className="bg-islamic-primary hover:bg-islamic-primary/90">Contact Us</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Playing?</h2>
            <p className="text-muted-foreground mb-6">
              Join us on this fun and educational journey through Islamic traditions and teachings.
            </p>
            <Link to="/games">
              <Button size="lg" className="bg-islamic-primary hover:bg-islamic-primary/90">
                Explore Games
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
