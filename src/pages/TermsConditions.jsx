import React from "react";
import "../styles/TermsConditions.css"; // We'll create this CSS file

const TermsConditions = () => {
  return (
    <div className="terms-page">
      <div className="terms-header">
        <h1>Better Health Terms and Conditions</h1>
      </div>
      
      <div className="terms-container">
        <div className="terms-sidebar">
          <div className="terms-nav">
            <ul>
              <li><a href="#introduction">1. Introduction</a></li>
              <li><a href="#definitions">2. Definitions</a></li>
              <li><a href="#eligibility">3. Eligibility & User Classification</a></li>
              <li><a href="#scope">4. Scope of Services</a></li>
              <li><a href="#user-responsibilities">5. User Responsibilities and Conduct</a></li>
              <li><a href="#payment">6. Payment, Pricing & Refunds</a></li>
              <li><a href="#consultant-responsibilities">7. Consultant Responsibilities</a></li>
              <li><a href="#data-handling">8. Data Handling & Confidentiality</a></li>
              <li><a href="#third-party">9. Use of Third-Party Services and Integrations</a></li>
              <li><a href="#liability">10. Limitation of Liability and Disclaimers</a></li>
              <li><a href="#conduct">11. User Conduct and Platform Rules</a></li>
              <li><a href="#intellectual-property">12. Intellectual Property</a></li>
              <li><a href="#termination">13. Termination of Services</a></li>
              <li><a href="#governing-law">14. Governing Law and Dispute Resolution</a></li>
              <li><a href="#modification">15. Modification of Terms</a></li>
              <li><a href="#contact">Contact Information</a></li>
            </ul>
          </div>
        </div>
        
        <div className="terms-content">
          {/* Introduction */}
          <section id="introduction" className="terms-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Better Health, a platform owned and operated by
              ElevateBiz Group, a registered entity under the MSME scheme in
              India. These Terms and Conditions ("Terms") govern your access
              to and use of our website (www.ideservebetterhealth.in), mobile
              site, and all related services, tools, and platforms
              (collectively, the "Platform").
            </p>
            <p>
              Better Health provides online services aimed at improving the
              overall wellness of individuals through offerings such as mental
              health counselling, cosmetologist consultations, and other
              wellness-based services, which may be introduced from time to
              time. All services are delivered exclusively online via secure
              communication platforms.
            </p>
            <p>
              By accessing, registering, or using any part of the Platform,
              you confirm that you have read, understood, and agreed to be
              bound by these Terms. If you do not agree with these Terms, you
              must refrain from using the Platform or any of the services
              offered.
            </p>
            <p>
              These Terms apply to all users of the Platform, including
              individuals seeking counselling, cosmetic, or wellness-related
              support, parents or guardians booking services on behalf of
              minors, and any other visitors or users of the site.
            </p>
          </section>

          {/* Definitions */}
          <section id="definitions" className="terms-section">
            <h2>2. Definitions</h2>
            <p>
              For the purposes of these Terms and Conditions, the following
              terms shall have the meanings assigned below. These definitions
              apply whether the terms are used in singular or plural form.
            </p>

            <div className="terms-subsection">
              <h3>a. "Better Health"</h3>
              <p>
                Refers to the online wellness platform operated by ElevateBiz
                Group, offering mental health counselling, cosmetologist
                consultations, and other related services through the website
                www.ideservebetterhealth.in.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>b. "ElevateBiz Group"</h3>
              <p>
                Refers to the registered business entity under the MSME
                scheme, legally responsible for the operation of the Better
                Health platform.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>c. "Platform"</h3>
              <p>
                Means the website, mobile site, associated tools, and digital
                interfaces provided by Better Health for offering its
                services, including any login or scheduling systems.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>d. "User"</h3>
              <p>
                Means any individual who visits, registers, or uses the
                Platform or any of its services, including guardians booking
                services for a minor.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>e. "Services"</h3>
              <p>
                Refers to the range of wellness-related offerings provided on
                the Platform, including online mental health counselling,
                cosmetologist consultations, and future services such as
                homeopathy, ayurveda, and related wellness programs.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>f. "Consultant"</h3>
              <p>
                Refers to independent professionals (including but not limited
                to psychologists, cosmetologists, or therapists) who provide
                services through the Platform on a sessional basis under a
                consultancy agreement with Better Health.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>g. "Session"</h3>
              <p>
                Refers to any scheduled consultation between a User and a
                Consultant conducted via an online medium (such as Google Meet
                or Doxy).
              </p>
            </div>

            <div className="terms-subsection">
              <h3>h. "MoM" (Minutes of Meeting)</h3>
              <p>
                Refers to confidential post-session documentation submitted by
                the Consultant to Better Health summarizing the session, for
                internal use and quality tracking.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>i. "Confidential Information"</h3>
              <p>
                Refers to any personal, medical, mental health, or identifying
                information shared by Users during or after a Session, or
                submitted by Consultants via MoMs.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>j. "Third-Party Tools"</h3>
              <p>
                Means external platforms and technologies integrated with or
                used by Better Health, including but not limited to Cashfree
                (for payments), Google Meet/Doxy (for video calls), WhatsApp
                Business, Google Forms, and Cloudinary.
              </p>
            </div>
          </section>
          
          {/* Eligibility & User Classification */}
          <section id="eligibility" className="terms-section">
            <h2>3. Eligibility & User Classification</h2>

            <div className="terms-subsection">
              <h3>a. General Eligibility</h3>
              <p>
                By accessing or using the Better Health Platform, you confirm
                that you are legally competent to enter into a binding
                agreement under applicable laws. If you are under the age of
                18, you may only use the Services with the involvement and
                consent of a parent or legal guardian.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>b. Services for Children (Under 18 Years)</h3>
              <p>
                Better Health offers specialized counselling services for
                children and adolescents. These sessions must be booked by a
                parent or legal guardian, who also consents to the collection
                and processing of the child's personal and sensitive data in
                accordance with our Privacy Policy. In such cases, the parent
                or guardian assumes full responsibility for the use of the
                Platform on behalf of the minor.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>c. Services for Adults (18 Years and Above)</h3>
              <p>
                Individuals aged 18 years or older may independently register,
                book sessions, and access Services offered through the
                Platform, provided they agree to these Terms and the
                associated Privacy Policy.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>d. Territorial Eligibility</h3>
              <p>
                The Platform is currently intended for Users residing in
                India. Access to the Platform from jurisdictions where the
                Services are illegal or restricted is prohibited. Users are
                solely responsible for compliance with local laws and
                regulations.
              </p>
            </div>
          </section>
          
          {/* Scope of Services */}
          <section id="scope" className="terms-section">
            <h2>4. Scope of Services</h2>
            <p>
              Better Health provides a range of wellness and consultation
              services via its online Platform, all of which are facilitated
              under the legal ownership of ElevateBiz Group. The Services are
              designed to promote mental, emotional, and physical wellbeing
              through confidential and accessible online support.
            </p>

            <div className="terms-subsection">
              <h3>a. Mental Health Counselling</h3>
              <p>
                Better Health connects Users with qualified mental health
                professionals (such as psychologists and counselors) for
                one-on-one online counselling sessions. Sessions are conducted
                via secure video conferencing tools such as Google Meet or
                Doxy, depending on the requirement and user preference.
                Counselling is available for both:
              </p>
              <ul className="styled-list">
                <li>
                  Children (under 18 years) – via parental/guardian booking.
                </li>
                <li>Adults (18+ years) – via direct individual booking.</li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>b. Cosmetologist Consultations</h3>
              <p>
                Users can book online appointments with cosmetology
                professionals for guidance on skincare, haircare, and
                aesthetic wellness. These are advisory sessions only and do
                not include physical treatments.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>
                c. Additional Wellness Services (Upcoming)
              </h3>
              <p>
                Better Health plans to expand into other wellness domains such
                as:
              </p>
              <ul className="styled-list">
                <li>Ayurveda</li>
                <li>Diet & Nutrition</li>
                <li>Homeopathy</li>
                <li>Other traditional and integrative wellness practices</li>
              </ul>
              <p>
                These services will also be delivered online and governed by
                these Terms upon their launch.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>d. Digital Appointment Management</h3>
              <p>
                All bookings are managed through the Platform's internal
                scheduling system. After a successful booking, Users receive a
                confirmation and meeting link via their registered email and
                calendar.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>e. Modes of Service Delivery</h3>
              <p>
                Services are rendered through secure third-party platforms,
                including:
              </p>
              <ul className="styled-list">
                <li>Google Meet – for standard video sessions</li>
                <li>
                  Doxy – for sessions requiring HIPAA-compliant environments
                </li>
                <li>Cashfree – for payment processing</li>
                <li>Google Forms / Cloudinary – for internal submissions</li>
              </ul>
              <p>
                Better Health reserves the right to change or upgrade these
                tools to ensure better security and user experience.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>f. No Emergency Services</h3>
              <p>
                Better Health does not provide crisis intervention, emergency
                psychiatric care, or immediate medical assistance. In case of
                emergencies, Users are advised to contact local emergency
                services or visit the nearest hospital immediately.
              </p>
            </div>
          </section>
          
          {/* User Responsibilities and Conduct */}
          <section id="user-responsibilities" className="terms-section">
            <h2>5. User Responsibilities and Conduct</h2>
            <p>
              By using the Better Health Platform, you agree to adhere to the
              following responsibilities and behavioral expectations. These
              provisions are in place to ensure a safe, respectful, and
              ethical environment for both Users and Consultants.
            </p>

            <div className="terms-subsection">
              <h3>a. Accurate Information</h3>
              <p>
                You agree to provide truthful, current, and complete
                information during registration, appointment booking, and any
                other interactions with the Platform. Better Health is not
                responsible for issues arising from incorrect or misleading
                information provided by you.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>b. Respectful Interaction</h3>
              <p>
                You must interact respectfully and professionally with all
                Consultants, support staff, and other users. Any form of
                harassment, abuse, use of offensive language, or
                discriminatory behavior is strictly prohibited and may result
                in termination of access without refund.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>c. Session Conduct</h3>
              <p>You must:</p>
              <ul className="styled-list">
                <li>Be punctual and prepared for your scheduled session.</li>
                <li>
                  Join from a quiet, private, and appropriate environment.
                </li>
                <li>
                  Ensure a stable internet connection and working video/audio
                  setup.
                </li>
                <li>
                  Not record, copy, or distribute any session or its content
                  without written permission from Better Health and the
                  Consultant.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>d. Parental Supervision</h3>
              <p>
                If you are booking services on behalf of a minor (under 18
                years), you are solely responsible for their participation.
                You must ensure the minor behaves appropriately during
                sessions and that the environment remains safe and
                non-disruptive.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>e. Use of Platform</h3>
              <p>You agree not to:</p>
              <ul className="styled-list">
                <li>Misuse or disrupt the Platform or its features</li>
                <li>
                  Attempt unauthorized access to any part of the Platform or
                  related systems
                </li>
                <li>
                  Upload or transmit malicious code, spam, or harmful content
                </li>
                <li>
                  Violate any applicable law, regulation, or third-party right
                  through your use
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>f. Confidentiality</h3>
              <p>
                You are responsible for maintaining the confidentiality of
                your login credentials and account activity. Any action
                performed through your account will be considered authorized
                by you. You must notify Better Health immediately of any
                suspected unauthorized use.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>g. Health Disclaimer</h3>
              <p>
                You understand that the services offered are advisory and
                wellness-based in nature. They do not substitute medical
                diagnosis, emergency intervention, or hospital care. You are
                solely responsible for seeking medical attention when needed.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>h. Payment Compliance</h3>
              <p>
                You agree to make timely payments using the approved methods
                provided on the Platform. Unpaid bookings may be canceled, and
                repeated payment issues may lead to account suspension.
              </p>
            </div>
          </section>
          
          {/* Payment, Pricing & Refunds */}
          <section id="payment" className="terms-section">
            <h2>6. Payment, Pricing & Refunds</h2>

            <div className="terms-subsection">
              <h3>a. Payment Gateway</h3>
              <p>
                All payments on the Better Health Platform are securely
                processed through Cashfree, a trusted third-party payment
                gateway. By completing a transaction, you agree to the terms
                and policies of Cashfree in addition to these Terms.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>b. Pricing Model</h3>
              <ul className="styled-list">
                <li>
                  <strong>One-Time Payment:</strong> Each session or service
                  is currently priced individually. The amount payable will be
                  clearly communicated at the time of booking.
                </li>
                <li>
                  <strong>Future Subscriptions:</strong> Better Health may
                  introduce subscription plans or bundled pricing in the
                  future, which will come with their own specific terms and
                  conditions.
                </li>
                <li>
                  <strong>Currency:</strong> All prices are listed in Indian
                  Rupees (INR) unless specified otherwise.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>c. Taxes and Charges</h3>
              <p>
                All applicable taxes and statutory charges are either included
                in the displayed price or will be calculated during checkout.
                Users are responsible for reviewing the final amount before
                confirming the payment.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>d. Payment Confirmation</h3>
              <p>Upon successful payment:</p>
              <ul className="styled-list">
                <li>
                  You will receive a confirmation email, SMS, call or WhatsApp
                  message (any of these) with session details.
                </li>
                <li>
                  The appointment link will be shared via email or added to
                  your Google Calendar.
                </li>
                <li>
                  If you do not receive confirmation within 24 hours, please
                  contact support immediately.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>e. Failed Transactions</h3>
              <p>
                In case of a failed transaction where the amount has been
                deducted:
              </p>
              <ul className="styled-list">
                <li>
                  You are required to contact Better Health with proof of
                  payment.
                </li>
                <li>
                  If verified, we will either confirm the appointment or
                  initiate a refund within 7 working days.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>f. Refunds and Cancellations</h3>
              <p>
                Better Health offers limited refunds for booked counselling or
                consultation sessions, subject to the timing of the
                cancellation:
              </p>
              <ul className="styled-list">
                <li>
                  <strong>90% Refund:</strong> If the session is cancelled by
                  the user more than 24 hours before the scheduled start time.
                </li>
                <li>
                  <strong>50% Refund:</strong> If the session is cancelled
                  within 24 hours of the scheduled start time.
                </li>
              </ul>
              <p>
                Refunds will be processed through the original mode of payment
                within a reasonable time frame. Any payment gateway fees or
                taxes deducted by third parties are non-refundable.
              </p>
              <p>No refund will be issued for:</p>
              <ul className="styled-list">
                <li>No-shows or missed sessions without cancellation</li>
                <li>
                  Partially attended or voluntarily discontinued sessions
                </li>
              </ul>
              <p>
                Better Health reserves the right to decline a refund request
                in cases of repeated cancellations or misuse of this policy.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>g. Non-Refundable Services</h3>
              <p>
                All completed sessions and services successfully rendered are
                considered non-refundable.
              </p>
            </div>
          </section>
          
          {/* Consultant Responsibilities */}
          <section id="consultant-responsibilities" className="terms-section">
            <h2>7. Consultant Responsibilities</h2>
            <p>
              All professionals providing services on the Better Health
              Platform—including but not limited to psychologists, therapists,
              and cosmetologists—are referred to as "Consultants." Consultants
              operate as independent professionals engaged through a
              service-based model and are not employees of ElevateBiz Group.
            </p>

            <div className="terms-subsection">
              <h3>a. Independent Service Providers</h3>
              <p>
                Consultants associated with Better Health are engaged on a
                sessional basis and operate under service agreements. They are
                not full-time or contractual employees unless explicitly
                stated in a separate written agreement.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>b. Licensing and Qualifications</h3>
              <p>
                Each Consultant is responsible for maintaining appropriate
                certifications, or qualifications relevant to their area of
                practice, as required under applicable laws and professional
                standards. Better Health reviews, verifies, and requests proof
                of qualifications.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>c. Professional Conduct</h3>
              <p>Consultants are expected to:</p>
              <ul className="styled-list">
                <li>
                  Maintain ethical, respectful, and professional interactions
                  with all Users.
                </li>
                <li>Adhere to privacy and confidentiality standards.</li>
                <li>
                  Avoid offering diagnosis or treatment beyond their scope of
                  practice.
                </li>
                <li>
                  Not promote or sell any personal services outside the Better
                  Health platform during official sessions.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>d. Session Management</h3>
              <p>Consultants must:</p>
              <ul className="styled-list">
                <li>Begin and end sessions on time.</li>
                <li>
                  Conduct sessions through approved platforms only (e.g.,
                  Google Meet, Doxy).
                </li>
                <li>
                  Ensure a quiet, professional, and private environment during
                  consultations.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>
                e. Submission of MoM (Minutes of Meeting)
              </h3>
              <p>
                After every counselling or advisory session, the Consultant is
                required to submit a MoM (Minutes of Meeting) to Better
                Health. This document:
              </p>
              <ul className="styled-list">
                <li>
                  Must include a summary of the session, action points, and
                  follow-up needs.
                </li>
                <li>May include sensitive or confidential User data.</li>
                <li>
                  Must be submitted via internal channels designated by Better
                  Health.
                </li>
                <li>
                  Will be used only for internal monitoring, continuity of
                  care, and quality assurance.
                </li>
              </ul>
              <p>
                All submitted MoMs are stored securely and handled in
                accordance with our Privacy Policy.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>f. Confidentiality Obligations</h3>
              <p>
                Consultants are strictly required to maintain the
                confidentiality of all User data and interactions. They may
                not share, disclose, or use any User-related information
                outside of the Platform for any reason, except as required by
                law or with prior written consent.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>g. Prohibited Conduct</h3>
              <p>Consultants are prohibited from:</p>
              <ul className="styled-list">
                <li>Soliciting Users for services outside the Platform.</li>
                <li>
                  Sharing personal contact details without authorization.
                </li>
                <li>
                  Engaging in dual relationships that could compromise ethical
                  integrity.
                </li>
                <li>
                  Using the session time for any purpose other than delivering
                  the agreed-upon service.
                </li>
              </ul>
            </div>
          </section>
          
          {/* Data Handling & Confidentiality */}
          <section id="data-handling" className="terms-section">
            <h2>8. Data Handling & Confidentiality</h2>
            <p>
              Better Health is committed to maintaining the highest standards
              of data protection, confidentiality, and transparency in the
              handling of User information. This section outlines how your
              data is managed, protected, and shared within the scope of our
              Services.
            </p>

            <div className="terms-subsection">
              <h3>a. Types of Data Collected</h3>
              <p>
                By using the Platform, you agree that Better Health may
                collect the following types of data:
              </p>
              <ul className="styled-list">
                <li>
                  <strong>Personal Information:</strong> Name, age, gender,
                  contact details, and guardian information (for minors).
                </li>
                <li>
                  <strong>Health Information:</strong> Mental health history,
                  consultation notes, symptoms, concerns.
                </li>
                <li>
                  <strong>Session Records:</strong> Information shared during
                  sessions, excluding audio/video recordings unless explicitly
                  stated.
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type,
                  login timestamps, and interaction data.
                </li>
                <li>
                  <strong>MoMs (Minutes of Meeting):</strong> Confidential
                  post-session notes prepared by Consultants.
                </li>
              </ul>
              <p>
                Refer to our Privacy Policy for detailed information on data
                categories and use.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>b. Storage and Security</h3>
              <p>
                We use secure, encrypted third-party services such as
                Cloudinary, Google Drive, and HIPAA-compliant tools like Doxy
                (when applicable) to store confidential records. Your data is
                protected with access controls, limited sharing, and periodic
                reviews.
              </p>
              <p>
                Despite our best efforts, no system can guarantee 100%
                security. Users agree to use the Platform at their own risk
                and are encouraged to keep login credentials confidential.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>c. Internal Access</h3>
              <p>User data is only accessible by:</p>
              <ul className="styled-list">
                <li>
                  Authorized members of the Better Health team for operational
                  and monitoring purposes.
                </li>
                <li>
                  Consultants assigned to a particular session, solely for
                  delivering the agreed service.
                </li>
              </ul>
              <p>
                MoM documents submitted by Consultants are treated as
                internal-use-only and are not shared with Users unless
                required by law or consented to.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>
                d. Third-Party Tools and Platforms
              </h3>
              <p>
                Better Health uses the following third-party services:
              </p>
              <ul className="styled-list">
                <li>Cashfree – For payment processing</li>
                <li>Google Meet / Doxy – For video sessions</li>
                <li>Google Forms – For data collection</li>
                <li>Cloudinary / Google Drive – For secured file storage</li>
                <li>
                  WhatsApp Business / Instagram – For communication and
                  community interaction
                </li>
              </ul>
              <p>
                By using the Platform, Users consent to the secure use of
                these services. However, each third-party tool is governed by
                its own privacy policy, and Better Health is not liable for
                breaches or failures on those platforms.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>e. Confidentiality in Sessions</h3>
              <ul className="styled-list">
                <li>All sessions are strictly confidential.</li>
                <li>
                  Consultants are bound by professional ethics and platform
                  policy not to disclose any client information.
                </li>
                <li>
                  Exceptions include legal obligations to report threats of
                  harm to self or others, child abuse, or court-ordered
                  disclosures.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>f. User Rights</h3>
              <p>Users have the right to:</p>
              <ul className="styled-list">
                <li>Access their data</li>
                <li>Request correction of inaccuracies</li>
                <li>Withdraw consent (which may limit access to services)</li>
                <li>
                  Request deletion, subject to our data retention obligations
                </li>
              </ul>
            </div>
          </section>
          
          {/* Use of Third-Party Services and Integrations */}
          <section id="third-party" className="terms-section">
            <h2>9. Use of Third-Party Services and Integrations</h2>
            <p>
              Better Health relies on a variety of third-party platforms and
              tools to enable seamless booking, consultation, communication,
              and payment experiences. By using the Platform, you acknowledge
              and consent to the integration and limited sharing of your data
              with these services, as required for delivery of the Services.
            </p>

            <div className="terms-subsection">
              <h3>a. Payment Processing – Cashfree</h3>
              <ul className="styled-list">
                <li>
                  All online payments for consultations and services are
                  processed through Cashfree, a secure and compliant payment
                  gateway.
                </li>
                <li>Users are redirected to Cashfree during checkout.</li>
                <li>
                  Payment details such as card or UPI information are
                  collected and stored securely by Cashfree.
                </li>
                <li>
                  Better Health does not store or have direct access to your
                  financial data.
                </li>
                <li>
                  Refer to Cashfree's Privacy Policy for more information.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>
                b. Video Conferencing – Google Meet and Doxy
              </h3>
              <p>
                Consultation sessions are conducted via:
              </p>
              <ul className="styled-list">
                <li>
                  <strong>Google Meet</strong> – standard video calls.
                </li>
                <li>
                  <strong>Doxy.me</strong> – a HIPAA-compliant platform for
                  sensitive or high-confidentiality cases.
                </li>
              </ul>
              <p>
                The platform used depends on availability, user preference,
                and regulatory needs. Better Health does not record sessions.
                However, Google or Doxy's own privacy practices apply.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>c. Data Collection – Google Forms</h3>
              <p>
                Better Health may use Google Forms for:
              </p>
              <ul className="styled-list">
                <li>Pre-session intake</li>
                <li>Feedback collection</li>
                <li>Internal consultant documentation</li>
              </ul>
              <p>
                Users submitting forms acknowledge that such data is stored
                securely and used only for internal and quality control
                purposes.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>
                d. Media & File Storage – Cloudinary
              </h3>
              <p>
                Certain files (e.g., MoM documents, resource materials) may be
                uploaded and stored via Cloudinary, a secure cloud platform.
                Access is strictly controlled, and files are encrypted where
                appropriate.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>
                e. Communication Platforms – Instagram & WhatsApp Business
              </h3>
              <p>
                Better Health uses Instagram and WhatsApp Business to:
              </p>
              <ul className="styled-list">
                <li>Share general mental health content</li>
                <li>Respond to inquiries</li>
                <li>Manage customer relationships</li>
              </ul>
              <p>
                These platforms are for informational and non-diagnostic
                communication only. Users engaging on these platforms are
                subject to their respective privacy policies.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>
                f. Limitations of Liability for Third-Party Tools
              </h3>
              <p>
                While Better Health carefully selects reputable third-party
                services, it does not control or guarantee the availability,
                reliability, or compliance of those platforms. Users agree
                that Better Health shall not be held liable for:
              </p>
              <ul className="styled-list">
                <li>Technical failures</li>
                <li>Data breaches</li>
                <li>
                  Loss of access or personal information occurring through
                  these services
                </li>
              </ul>
            </div>
          </section>
          
          {/* Limitation of Liability and Disclaimers */}
          <section id="liability" className="terms-section">
            <h2>10. Limitation of Liability and Disclaimers</h2>
            <p>
              Better Health strives to deliver safe, professional, and ethical
              services across all its offerings. However, as with any online
              and human-centered service, there are limitations. This section
              outlines the boundaries of our responsibilities and provides
              important disclaimers for users.
            </p>

            <div className="terms-subsection">
              <h3>a. Service Disclaimer</h3>
              <ul className="styled-list">
                <li>
                  Better Health is a wellness and advisory platform, not a
                  medical institution.
                </li>
                <li>
                  Our services are not a substitute for medical diagnosis,
                  psychiatric intervention, or emergency care.
                </li>
                <li>
                  If you are experiencing a medical emergency, you must
                  contact local emergency services immediately.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>b. Professional Qualifications</h3>
              <p>
                While Better Health verifies the credentials of its
                Consultants at the time of onboarding, we do not guarantee:
              </p>
              <ul className="styled-list">
                <li>
                  The completeness or accuracy of any Consultant's advice
                </li>
                <li>
                  That a particular Consultant will be suitable or effective
                  for your individual needs
                </li>
                <li>
                  That outcomes from sessions will match your expectations
                </li>
              </ul>
              <p>
                We encourage users to approach consultations with discretion
                and to seek medical or legal advice when necessary.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>c. No Guarantees of Outcomes</h3>
              <ul className="styled-list">
                <li>
                  Better Health does not guarantee any specific results,
                  outcomes, or progress from sessions or consultations.
                </li>
                <li>
                  Mental wellness and cosmetic results are deeply personal and
                  may vary significantly based on individual effort,
                  engagement, and other external factors.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>d. Third-Party Tools and Downtime</h3>
              <ul className="styled-list">
                <li>
                  Better Health is not liable for outages, performance issues,
                  or data loss caused by third-party services (e.g., Google
                  Meet, Cashfree, Cloudinary, etc.).
                </li>
                <li>
                  While we make every effort to ensure continuous access, we
                  do not guarantee that the Platform will be available at all
                  times or free from technical errors.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>e. Liability Cap</h3>
              <p>
                To the maximum extent permitted by law:
              </p>
              <ul className="styled-list">
                <li>
                  Better Health, ElevateBiz Group, its officers, directors,
                  employees, or partners shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages,
                  including but not limited to:
                  <ul className="styled-list" style={{ marginTop: "10px" }}>
                    <li>Personal injury</li>
                    <li>Emotional distress</li>
                    <li>Lost profits or revenue</li>
                    <li>Unauthorized access or data breaches</li>
                  </ul>
                </li>
                <li>
                  Our total liability for any claim related to the Platform or
                  Services shall not exceed the total amount paid by the User
                  for the Service giving rise to the claim in the preceding 30
                  days.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>f. User Responsibility</h3>
              <p>
                You agree to use the Platform at your own discretion and risk.
                Better Health cannot be held responsible for:
              </p>
              <ul className="styled-list">
                <li>Misuse of services</li>
                <li>Misinterpretation of advice</li>
                <li>Failing to follow up on professional guidance</li>
              </ul>
            </div>
          </section>
          
          {/* User Conduct and Platform Rules */}
          <section id="conduct" className="terms-section">
            <h2>11. User Conduct and Platform Rules</h2>
            <p>
              To maintain a respectful, ethical, and secure environment, all
              Users of the Better Health platform must comply with the
              following conduct and behavior standards. Use of the platform is
              conditional on your adherence to these rules.
            </p>

            <div className="terms-subsection">
              <h3>a. Respectful and Ethical Use</h3>
              <p>You agree to:</p>
              <ul className="styled-list">
                <li>
                  Treat Consultants, staff, and fellow users with respect and
                  courtesy.
                </li>
                <li>
                  Use the services only for lawful and ethical purposes.
                </li>
                <li>
                  Provide accurate, complete, and up-to-date information when
                  creating an account or booking services.
                </li>
                <li>
                  Engage in sessions in a focused, distraction-free, and
                  private setting.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>b. Prohibited Activities</h3>
              <p>You must not:</p>
              <ul className="styled-list">
                <li>
                  Misrepresent your identity, health conditions, or purpose of
                  consultation.
                </li>
                <li>
                  Attempt to access, tamper with, or misuse confidential
                  records or session materials.
                </li>
                <li>
                  Record, share, or publish any portion of a consultation
                  without explicit written consent.
                </li>
                <li>
                  Harass, abuse, threaten, or behave inappropriately with
                  Consultants or other users.
                </li>
                <li>
                  Use the platform to promote illegal, harmful, or unrelated
                  commercial activities.
                </li>
                <li>
                  Post false reviews, defame the platform, or impersonate
                  another person.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>c. Account Security</h3>
              <ul className="styled-list">
                <li>
                  You are solely responsible for maintaining the
                  confidentiality of your login credentials.
                </li>
                <li>
                  You agree to notify Better Health immediately of any
                  unauthorized access or security breach.
                </li>
                <li>
                  Better Health is not responsible for damages or losses
                  caused by unauthorized account access.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>d. Session Access and Punctuality</h3>
              <ul className="styled-list">
                <li>
                  Users must join their scheduled sessions on time through the
                  link provided after logging in.
                </li>
                <li>
                  Late arrivals or no-shows may result in session forfeiture,
                  without refund, unless otherwise stated in the cancellation
                  policy.
                </li>
                <li>
                  Repeated missed sessions without notice may lead to
                  suspension of your account.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>
                e. Children and Parental Supervision
              </h3>
              <ul className="styled-list">
                <li>
                  Users under the age of 18 must use the platform under the
                  supervision of a parent or legal guardian.
                </li>
                <li>
                  The parent/guardian may be asked to provide consent and must
                  be present during sessions as required.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>f. Breach of Conduct</h3>
              <p>
                Any violation of these conduct rules may result in:
              </p>
              <ul className="styled-list">
                <li>Temporary or permanent suspension of your account</li>
                <li>Cancellation of active services without refund</li>
                <li>
                  Legal action or reporting to relevant authorities, if
                  necessary
                </li>
              </ul>
            </div>
          </section>
          
          {/* Intellectual Property */}
          <section id="intellectual-property" className="terms-section">
            <h2>12. Intellectual Property</h2>
            <p>
              All content, tools, branding elements, and service methodologies
              used or displayed on the Better Health Platform are the
              intellectual property of ElevateBiz Group, unless otherwise
              stated. This section outlines what you can and cannot do with
              that content.
            </p>

            <div className="terms-subsection">
              <h3>a. Ownership</h3>
              <p>
                All intellectual property rights in:
              </p>
              <ul className="styled-list">
                <li>
                  Website content (including text, graphics, icons, structure,
                  and user interface)
                </li>
                <li>Logos, brand name ("Better Health"), and slogans</li>
                <li>
                  Audio-visual content shared through the platform or social
                  media
                </li>
                <li>
                  Blog articles, educational materials, downloadable guides
                </li>
                <li>
                  Appointment formats, feedback forms, and consultation
                  templates
                </li>
              </ul>
              <p>
                are either solely owned by ElevateBiz Group or licensed for
                use by Better Health. These are protected under applicable
                Indian and international copyright, trademark, and trade
                secret laws.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>b. User Access and Restrictions</h3>
              <p>
                By using the Platform, you are granted a limited,
                non-exclusive, non-transferable license to access and view
                content for personal, non-commercial use only.
              </p>
              <p>You are not allowed to:</p>
              <ul className="styled-list">
                <li>
                  Copy, reproduce, modify, distribute, or publicly display
                  platform content without prior written permission
                </li>
                <li>
                  Use Better Health's branding or service methods for any
                  competing or commercial activity
                </li>
                <li>
                  Reverse-engineer or replicate any functionality or user
                  interface elements from our platform
                </li>
              </ul>
              <p>
                Any unauthorized use of our intellectual property will be
                considered a violation and may result in suspension of access,
                legal action, or both.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>c. Third-Party Content</h3>
              <p>
                Certain content or tools on the Platform may include licensed
                material from third-party providers. All such content remains
                the intellectual property of their respective owners, and you
                are subject to their terms of use as well.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>d. User-Generated Content</h3>
              <p>
                If Users submit reviews, testimonials, suggestions, or
                feedback:
              </p>
              <ul className="styled-list">
                <li>
                  You grant Better Health a worldwide, royalty-free, perpetual
                  license to use, display, reproduce, and distribute such
                  content for promotional or operational purposes.
                </li>
                <li>
                  We reserve the right to moderate, edit, or remove any
                  content that violates our platform guidelines or community
                  standards.
                </li>
              </ul>
            </div>
          </section>
          
          {/* Termination of Services */}
          <section id="termination" className="terms-section">
            <h2>13. Termination of Services</h2>
            <p>
              Better Health reserves the right to suspend or terminate your
              access to the Platform or Services at its sole discretion, with
              or without prior notice, under the conditions described below.
            </p>

            <div className="terms-subsection">
              <h3>a. Termination by the User</h3>
              <p>
                You may discontinue use of Better Health's services at any
                time by:
              </p>
              <ul>
                <li>Logging out and ceasing to use the Platform, or</li>
                <li>
                  Requesting account deactivation via email at
                  admin@ideservebetterhealth.in
                </li>
              </ul>
              <p>Please note:</p>
              <ul>
                <li>
                  Termination does not automatically qualify for a refund
                  unless stated in the cancellation policy.
                </li>
                <li>
                  Historical data (e.g., session notes) may be retained for
                  internal record-keeping or legal compliance.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>b. Termination by Better Health</h3>
              <p>
                We may suspend or permanently terminate your access to
                services if:
              </p>
              <ul>
                <li>
                  You violate these Terms and Conditions or other platform
                  policies
                </li>
                <li>
                  You engage in abusive, fraudulent, or inappropriate behavior
                </li>
                <li>You miss multiple sessions without prior notice</li>
                <li>
                  You misuse, share, or attempt to duplicate protected content
                </li>
                <li>
                  You engage in illegal activity through or in connection with
                  the Platform
                </li>
              </ul>
              <p>
                In severe cases, termination may occur without prior warning.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>c. Consequences of Termination</h3>
              <p>Upon termination:</p>
              <ul>
                <li>
                  You lose access to any scheduled services and internal notes
                </li>
                <li>
                  Your account and profile may be deactivated or deleted
                </li>
                <li>
                  Any remaining credits or sessions are subject to refund or
                  forfeiture in accordance with our refund policy
                </li>
                <li>
                  Better Health may retain certain personal data as required
                  by law, ethical obligations, or platform policies.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>d. Right to Deny Access</h3>
              <p>
                Better Health reserves the right to refuse services to anyone
                for reasons including but not limited to violation of laws,
                disrespectful conduct, or non-compliance with platform values,
                especially when such behavior affects the safety of our
                Consultants or other Users.
              </p>
            </div>
          </section>
          
          {/* Governing Law and Dispute Resolution */}
          <section id="governing-law" className="terms-section">
            <h2>14. Governing Law and Dispute Resolution</h2>
            <p>
              This section outlines the legal framework under which Better
              Health operates and how disputes, if any, will be resolved.
            </p>

            <div className="terms-subsection">
              <h3>a. Governing Law</h3>
              <ul>
                <li>
                  These Terms and Conditions, the Privacy Policy, and all
                  interactions between Users and Better Health shall be
                  governed by and construed in accordance with the laws of
                  India, without regard to its conflict of law principles.
                </li>
                <li>
                  All services are considered to be performed and delivered
                  virtually from the registered business location of
                  ElevateBiz Group in Jaipur, Rajasthan, India.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>b. Jurisdiction</h3>
              <p>
                You agree that any disputes, claims, or legal proceedings
                arising out of or relating to these Terms or your use of the
                Platform shall be subject to the exclusive jurisdiction of the
                competent courts located in Jaipur, Rajasthan, India.
              </p>
            </div>

            <div className="terms-subsection">
              <h3>c. Dispute Resolution Procedure</h3>
              <p>In the event of a dispute:</p>
              <ul>
                <li>
                  <strong>Informal Resolution First</strong> – Users are
                  encouraged to contact Better Health at
                  admin@ideservebetterhealth.in to attempt a good-faith
                  resolution.
                </li>
                <li>
                  <strong>Formal Resolution</strong> – If informal resolution
                  fails, the dispute may be resolved through legal proceedings
                  under the jurisdiction mentioned above.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>d. Arbitration</h3>
              <p>
                Any dispute or difference arising out of or in connection with
                this Agreement shall be settled by arbitration in accordance
                with the Arbitration and Conciliation Act, 1996. The seat and
                venue of arbitration shall be Jaipur, India. The language of
                arbitration shall be English. The decision of the sole
                arbitrator shall be final and binding.
              </p>
            </div>
          </section>
          
          {/* Modification of Terms */}
          <section id="modification" className="terms-section">
            <h2>15. Modification of Terms</h2>
            <p>
              Better Health reserves the right to modify, update, or revise
              these Terms and Conditions at any time, at its sole discretion.
              We believe in transparency and strive to keep our Users
              informed.
            </p>

            <div className="terms-subsection">
              <h3>a. Change Notification</h3>
              <ul>
                <li>
                  Any changes will be posted on this page with an updated
                  "Last Updated" date at the top of the Terms and Conditions.
                </li>
                <li>
                  Users may also be notified via email or a banner on the
                  website if the changes are significant.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>b. Continued Use as Consent</h3>
              <ul>
                <li>
                  By continuing to access or use the Platform or Services
                  after changes become effective, you agree to be bound by the
                  revised Terms.
                </li>
                <li>
                  If you do not agree with the modifications, your only remedy
                  is to discontinue use of the Platform and Services.
                </li>
              </ul>
            </div>

            <div className="terms-subsection">
              <h3>c. Responsibility to Stay Informed</h3>
              <p>
                It is your responsibility to periodically review these Terms.
                We recommend checking them every time you use the Platform,
                especially before booking a service.
              </p>
            </div>
          </section>
          
          {/* Contact Information */}
          <section id="contact" className="terms-section">
            <h2>Contact Information</h2>
            <p>
              For any questions, concerns, or support related to these Terms
              and Conditions or our services, please contact us:
            </p>
            <div className="terms-contact-info">
              <p>
                <strong>Email:</strong> admin@ideservebetterhealth.in
              </p>
              <p>
                <strong>Response Time:</strong> We aim to respond to all
                inquiries within 3-5 business days.
              </p>
              <p>
                <strong>Platform:</strong> www.ideservebetterhealth.in
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
