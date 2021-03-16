import iconv from 'iconv-lite'
import { CallbackListItem } from '../types/utools'
import { api, customGot } from '../utils/api'
import { getCookieJar } from '../utils/login'

const assignmentIconType = ['assets/assignment_unfinished.png', 'assets/assignment_finished.png']

const getAssignmentList = async (): Promise<CallbackListItem[]> => {
  const cookieJar = getCookieJar()
  const body = await customGot(api.getAssignmentData, {
    cookieJar,
  }).buffer()

  const content = iconv.decode(body, 'GBK')
  const isHaveAssignment = content.includes('有待提交作业')

  if (!isHaveAssignment) return [{ title: '无未提交作业', description: '' }]

  const li = content.match(new RegExp('(?<=<a.*title=".*".*>)(.|\n)*?(?=</ul>)', 'gi'))[1]
  const courses = li.match(new RegExp('(?<=<a.*onclick.*>[^>]*)([^<]+).*?(?=</a)', 'gi'))
  const lids = li.match(new RegExp('(?<=lid=).*?(?=&)', 'gi'))

  return [
    { title: `有${courses.length}门待提交作业`, description: '', icon: 'assets/assignment.png' },
  ].concat(
    courses.map((item, i) => {
      return {
        title: item.trim(),
        feature: 'assignment',
        description: '',
        icon: 'assets/assignment.png',
        subArgument: {
          lid: lids[i],
        },
      }
    }),
  )
}

const getAssignmentSubList = async ({ lid }: { lid: string }): Promise<CallbackListItem[]> => {
  const cookieJar = getCookieJar()
  await customGot(api.switchCourse, {
    cookieJar,
    searchParams: {
      lid,
      t: 'hw',
    },
  })

  const body = await customGot(api.getAssignmentDetailData, { cookieJar }).buffer()
  const content = iconv.decode(body, 'GBK')

  const list: CallbackListItem[] = content
    .match(new RegExp('(?<=<tr.*>)(.|\n)*?(?=</tr>)', 'gi'))
    .map((item, i) => {
      if (i < 2) return { title: '', description: '', icon: '' }
      const title = item.match(new RegExp('(?<=<a.*class="infolist".*>).*?(?=</a)', 'gi'))[0]
      const info = item.match(new RegExp('(?<=<td.*class="align_c".*>)([^<]+).*?(?=</td>)', 'gi'))
      const isFinished = item.includes('查看结果')
      return {
        title,
        description: `老师: ${info[2].trim()}, 截止日期: ${info[0].trim()}`,
        icon: assignmentIconType[+isFinished],
      }
    })
    .filter((item) => item.title)

  return list
}

export { getAssignmentList, getAssignmentSubList }
