using Escc.Umbraco.PropertyEditors.RichTextPropertyEditor;
using NUnit.Framework;

namespace Escc.Umbraco.PropertyEditors.Tests
{
    [TestFixture]
    class EncodeEmailAddressFormatterTests
    {
        [Test]
        public void EncodeEmailAddressWithinLink()
        {
            const string before = "<a href=\"http://www.example.org/\">first.last@eastsussex.gov.uk</a>";
            const string after = "<a href=\"http://www.example.org/\">&#102;&#105;&#114;&#115;&#116;&#46;&#108;&#97;&#115;&#116;&#64;&#101;&#97;&#115;&#116;&#115;&#117;&#115;&#115;&#101;&#120;&#46;&#103;&#111;&#118;&#46;&#117;&#107;</a>";

            var result = new EncodeEmailAddressFormatter().Format(before);

            Assert.AreEqual(after, result);
        }

        [Test]
        public void EncodeEmailAddressWithinText()
        {
            const string before = "You can send an email to anyone123@example-domain.anything at any time";
            const string after = "You can send an email to &#97;&#110;&#121;&#111;&#110;&#101;&#49;&#50;&#51;&#64;&#101;&#120;&#97;&#109;&#112;&#108;&#101;&#45;&#100;&#111;&#109;&#97;&#105;&#110;&#46;&#97;&#110;&#121;&#116;&#104;&#105;&#110;&#103; at any time";

            var result = new EncodeEmailAddressFormatter().Format(before);

            Assert.AreEqual(after, result);
        }
    }
}
