using Escc.Umbraco.PropertyEditors.RichTextValueConverter;
using NUnit.Framework;

namespace Escc.Umbraco.PropertyEditors.Tests
{
    [TestFixture]
    public class TinyMceEmbedClassFormatterTests
    {
        private const string OpenSpan = "<span class=\"embed\">";
        private const string CloseSpan = "</span>";
        private const string PlainLinkBefore = "<a href=\"http://example.org\">";
        private const string TextContent = "example link";
        private const string CloseLink = "</a>";
        private const string PlainLinkAfter = "<a class=\"embed\" href=\"http://example.org\">";

        [Test]
        public void CombinesSpanWithEmbedClassAndPlainAnchor()
        {
            const string before = OpenSpan + PlainLinkBefore + TextContent + CloseLink + CloseSpan;
            const string after = PlainLinkAfter + TextContent + CloseLink;

            var result = new TinyMceEmbedClassFormatter().Format(before);

            Assert.AreEqual(after, result);
        }

        [Test]
        public void TreatsTwoMatchesSeparately()
        {
            const string otherText = " other text between the links ";
            const string before =
                OpenSpan + PlainLinkBefore + TextContent + CloseLink + CloseSpan + otherText + OpenSpan + PlainLinkBefore + TextContent + CloseLink + CloseSpan;
            const string after = PlainLinkAfter + TextContent + CloseLink + otherText + PlainLinkAfter + TextContent + CloseLink;

            var result = new TinyMceEmbedClassFormatter().Format(before);

            Assert.AreEqual(after, result);
        }

        [Test]
        public void RecognisesLinkWithNestedElement()
        {
            const string nestedHtml = "example link <strong>with</strong> nested element";
            const string before = OpenSpan + PlainLinkBefore + nestedHtml + CloseLink + CloseSpan;
            const string after = PlainLinkAfter + nestedHtml + CloseLink;

            var result = new TinyMceEmbedClassFormatter().Format(before);

            Assert.AreEqual(after, result);
        }
    }
}
