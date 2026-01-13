import ContentWrapper from "@/components/custom/ContentWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import { FileText, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <ContentWrapper>
      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-8 shadow-lg bg-white/20 backdrop-blur-sm">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 text-white">
              Welcome to ResearchHub
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
              {isAuthenticated
                ? `Hello, ${user?.username}! Ready to explore your research documents?`
                : "Upload your documents and get instant AI-powered insights and answers"}
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/auth/sign-up")}
                  className="text-lg px-8 bg-white text-purple-600 hover:bg-white/90 shadow-xl font-semibold"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/auth/sign-in")}
                  className="text-lg px-8 border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  Sign In
                </Button>
              </div>
            )}
            {isAuthenticated && (
              <>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <Card className="hover:shadow-2xl transition-all cursor-pointer bg-white/95 backdrop-blur-md border-0">
                    <CardHeader>
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))",
                        }}
                      >
                        <FileText
                          className="h-7 w-7"
                          style={{ color: "#667eea" }}
                        />
                      </div>
                      <CardTitle style={{ color: "#667eea" }}>
                        Upload Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Upload PDFs and documents for AI analysis
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-2xl transition-all cursor-pointer bg-white/95 backdrop-blur-md border-0">
                    <CardHeader>
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))",
                        }}
                      >
                        <Mail
                          className="h-7 w-7"
                          style={{ color: "#667eea" }}
                        />
                      </div>
                      <CardTitle style={{ color: "#667eea" }}>
                        Ask Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Chat with your documents using RAG technology
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-2xl transition-all cursor-pointer bg-white/95 backdrop-blur-md border-0">
                    <CardHeader>
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))",
                        }}
                      >
                        <User
                          className="h-7 w-7"
                          style={{ color: "#667eea" }}
                        />
                      </div>
                      <CardTitle style={{ color: "#667eea" }}>
                        Get Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Generate summaries and extract key information
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex justify-center mb-12 my-4">
                  <Button
                    size="lg"
                    onClick={() => navigate("/upload/file")}
                    className="text-lg px-10 py-6 font-semibold bg-white text-purple-600 shadow-xl hover:text-purple-600 hover:bg-white"
                  >
                    Start Exploring
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};
export default Home;
