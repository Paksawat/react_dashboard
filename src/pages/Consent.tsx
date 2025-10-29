import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Consent = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-2xl'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center text-gray-900'>
            Data Collection Consent Form
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='prose prose-sm max-w-none'>
            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              About This Survey
            </h3>
            <p className='text-gray-700 mb-4'>
              We are conducting surveys to better understand employee wellbeing,
              satisfaction, and engagement within our organization. Your
              participation is voluntary and your responses will help us improve
              the workplace experience for everyone.
            </p>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              What We Collect
            </h3>
            <ul className='list-disc list-inside text-gray-700 mb-4 space-y-1'>
              <li>Survey responses related to your work experience</li>
              <li>Wellbeing and satisfaction ratings</li>
              <li>Feedback on workplace conditions</li>
              <li>Demographic information (department, role level)</li>
            </ul>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              How We Use Your Data
            </h3>
            <ul className='list-disc list-inside text-gray-700 mb-4 space-y-1'>
              <li>Analyze trends and patterns in employee satisfaction</li>
              <li>Identify areas for workplace improvement</li>
              <li>Generate anonymous reports for management</li>
              <li>Develop programs to enhance employee wellbeing</li>
            </ul>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              Data Protection
            </h3>
            <ul className='list-disc list-inside text-gray-700 mb-4 space-y-1'>
              <li>All responses are anonymized and aggregated</li>
              <li>Individual responses cannot be traced back to you</li>
              <li>Data is stored securely and encrypted</li>
              <li>Access is limited to authorized personnel only</li>
            </ul>

            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              Your Rights
            </h3>
            <ul className='list-disc list-inside text-gray-700 mb-4 space-y-1'>
              <li>You can withdraw consent at any time</li>
              <li>You can skip any questions you're uncomfortable with</li>
              <li>You can request information about how your data is used</li>
              <li>You can contact us with any privacy concerns</li>
            </ul>

            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
              <h4 className='font-semibold text-blue-900 mb-2'>
                Contact Information
              </h4>
              <p className='text-blue-800 text-sm'>
                If you have any questions about this consent form or our data
                practices, please contact our HR department or privacy officer.
              </p>
            </div>
          </div>

          <div className='text-center pt-4'>
            <Button
              variant='outline'
              onClick={() => window.close()}
              className='w-full sm:w-auto'
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Consent;
